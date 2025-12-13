import { getLMSData } from './whoData';

// Tipe Data Hasil Analisis Diperbarui
export type AnalysisResult = {
  category: 'Balita (0-5 Tahun)' | 'Anak/Remaja (5-19 Tahun)' | 'Dewasa';
  bmi: number;
  zScore?: number;
  zScoreLabel?: string; // Tambahan label (BB/U atau TB/U)
  status: string;
  color: string;
  description: string;
  recommendation: string;
};

// --- Helper Rumus LMS ---
function calculateLMS(val: number, L: number, M: number, S: number) {
  if (Math.abs(L) < 0.01) return Math.log(val / M) / S;
  return (Math.pow(val / M, L) - 1) / (L * S);
}

// ==========================================
// 1. RUMUS KHUSUS BALITA (0 - 60 Bulan)
// ==========================================
function analyzeToddler(ageMonths: number, weight: number, height: number, gender: 'male' | 'female'): AnalysisResult {
  
  // A. SANITY CHECK (Cegah input tidak logis)
  if (height > 150 || height < 30) {
    return {
      category: 'Balita (0-5 Tahun)',
      bmi: 0,
      zScore: 0,
      status: 'Data Tinggi Tidak Valid',
      color: 'text-gray-500',
      description: 'Tinggi badan di luar rentang wajar balita (30-150 cm).',
      recommendation: 'Mohon periksa kembali input tinggi badan.'
    };
  }
  
  // B. Hitung Z-Score
  const wfaData = getLMSData(ageMonths, gender, 'weight'); // Berat menurut Umur
  const zScoreWeight = calculateLMS(weight, wfaData.L, wfaData.M, wfaData.S);

  const hfaData = getLMSData(ageMonths, gender, 'height'); // Tinggi menurut Umur
  const zScoreHeight = calculateLMS(height, hfaData.L, hfaData.M, hfaData.S);

  // Hitung BMI (sekedar data tambahan)
  const heightM = height / 100;
  const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

  // C. LOGIKA PENENTUAN STATUS & Z-SCORE YANG DITAMPILKAN
  // Default: Gizi Baik (Tampilkan BB/U karena lebih fluktuatif/sensitif untuk nutrisi)
  let status = 'Gizi Baik (Normal)';
  let color = 'text-green-600';
  let desc = 'Berat dan tinggi badan ideal sesuai usia.';
  let rec = 'Pertahankan pola makan gizi seimbang.';
  let displayZScore = zScoreWeight; // Default tampilkan BB/U
  let displayLabel = 'BB/U'; // Label Berat/Umur

  // 1. Cek Stunting (Prioritas Tinggi - Masalah Kronis)
  if (zScoreHeight < -3) {
    status = 'Sangat Pendek (Severely Stunted)';
    color = 'text-red-700';
    desc = 'Tinggi badan sangat kurang. Indikasi gangguan pertumbuhan jangka panjang.';
    rec = 'Segera konsultasi ke Dokter Spesialis Anak. Perlu intervensi gizi & stimulasi.';
    displayZScore = zScoreHeight;
    displayLabel = 'TB/U'; // Tampilkan TB/U karena ini masalah utamanya
  } else if (zScoreHeight < -2) {
    status = 'Pendek (Stunted)';
    color = 'text-orange-600';
    desc = 'Tinggi badan di bawah rata-rata anak seusianya.';
    rec = 'Perbaiki asupan protein hewani (telur, ikan, daging), susu, dan tidur cukup.';
    displayZScore = zScoreHeight;
    displayLabel = 'TB/U';
  } else if (zScoreHeight > 3) {
    status = 'Tinggi Lebih (Tall)';
    color = 'text-purple-600';
    desc = 'Tinggi badan jauh di atas rata-rata.';
    rec = 'Biasanya genetik, namun konsultasikan jika pertumbuhan terlalu drastis.';
    displayZScore = zScoreHeight;
    displayLabel = 'TB/U';
  }
  // 2. Cek Berat Badan (Masalah Akut)
  // Jika tinggi normal, cek apakah beratnya bermasalah
  else if (zScoreWeight < -3) {
    status = 'Gizi Buruk (Severely Underweight)';
    color = 'text-red-600';
    desc = 'Berat badan sangat kurang. Berbahaya bagi perkembangan otak.';
    rec = 'Butuh Makanan Tambahan (PMT) padat kalori segera. Rujuk ke Puskesmas.';
    displayZScore = zScoreWeight;
    displayLabel = 'BB/U';
  } else if (zScoreWeight < -2) {
    status = 'Gizi Kurang (Underweight)';
    color = 'text-orange-500';
    desc = 'Berat badan kurang dari standar.';
    rec = 'Tambah porsi makan, double protein hewani, dan lemak tambahan.';
    displayZScore = zScoreWeight;
    displayLabel = 'BB/U';
  } else if (zScoreWeight > 2) {
    status = 'Risiko Gizi Lebih';
    color = 'text-yellow-600';
    desc = 'Berat badan berlebih dibanding usia.';
    rec = 'Kurangi gula/garam dan makanan manis. Perbanyak aktivitas fisik.';
    displayZScore = zScoreWeight;
    displayLabel = 'BB/U';
  }

  return {
    category: 'Balita (0-5 Tahun)',
    bmi,
    zScore: parseFloat(displayZScore.toFixed(2)), // Z-Score dinamis sesuai masalah
    zScoreLabel: displayLabel,
    status,
    color,
    description: desc,
    recommendation: rec
  };
}

// ==========================================
// 2. RUMUS DEWASA (Logic Sederhana BMI)
// ==========================================
function analyzeAdult(weight: number, height: number): AnalysisResult {
  const heightM = height / 100;
  
  if (heightM < 0.5 || heightM > 3.0) {
     return {
        category: 'Dewasa',
        bmi: 0,
        status: 'Data Tidak Valid',
        color: 'text-gray-500',
        description: 'Tinggi badan tidak valid.',
        recommendation: 'Cek input tinggi badan.'
     };
  }

  const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

  let status = '';
  let color = '';
  let desc = '';
  let rec = '';

  if (bmi < 18.5) {
    status = 'Berat Kurang (Underweight)';
    color = 'text-orange-500';
    desc = 'BMI di bawah 18.5.';
    rec = 'Tingkatkan asupan kalori padat gizi & latihan beban.';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    status = 'Berat Normal';
    color = 'text-green-600';
    desc = 'BMI ideal.';
    rec = 'Pertahankan pola hidup sehat.';
  } else if (bmi >= 25 && bmi <= 29.9) {
    status = 'Berat Berlebih (Overweight)';
    color = 'text-yellow-600';
    desc = 'BMI antara 25 - 29.9.';
    rec = 'Defisit kalori ringan dan kurangi gula.';
  } else {
    status = 'Obesitas';
    color = 'text-red-600';
    desc = 'BMI di atas 30.';
    rec = 'Konsultasi diet dan rutin olahraga.';
  }

  return {
    category: 'Dewasa',
    bmi,
    zScore: 0, 
    zScoreLabel: 'BMI',
    status,
    color,
    description: desc,
    recommendation: rec
  };
}

// --- MAIN FUNCTION ---
export const assessNutritionalStatus = (
  ageMonths: number,
  weight: number,
  height: number,
  gender: 'male' | 'female'
): AnalysisResult => {
  if (ageMonths <= 60) {
    return analyzeToddler(ageMonths, weight, height, gender);
  } else {
    const result = analyzeAdult(weight, height);
    if (ageMonths < 228) {
       result.category = 'Anak/Remaja (5-19 Tahun)';
       result.description += ' (Menggunakan standar BMI umum).';
    }
    return result;
  }
};