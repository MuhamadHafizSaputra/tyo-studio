import { getLMSData } from './whoData';

// Tipe Data Hasil Analisis
export type AnalysisResult = {
  category: 'Balita (0-5 Tahun)' | 'Anak/Remaja (5-19 Tahun)' | 'Dewasa';
  bmi: number;
  zScore?: number; // Optional karena Dewasa tidak butuh Z-Score
  status: string;
  color: string;
  description: string;
  recommendation: string;
};

// ==========================================
// 1. RUMUS KHUSUS BALITA (0 - 60 Bulan) - Menggunakan LMS
// ==========================================
function analyzeToddler(ageMonths: number, weight: number, height: number, gender: 'male' | 'female'): AnalysisResult {
  // Hitung Z-Score Berat Badan (Weight-for-Age)
  const wfaData = getLMSData(ageMonths, gender, 'weight');
  const zScoreWeight = calculateLMS(weight, wfaData.L, wfaData.M, wfaData.S);

  // Hitung Z-Score Tinggi Badan (Height-for-Age)
  const hfaData = getLMSData(ageMonths, gender, 'height');
  const zScoreHeight = calculateLMS(height, hfaData.L, hfaData.M, hfaData.S);

  // Logika Status Gizi (Kombinasi Berat & Tinggi)
  let status = 'Gizi Baik';
  let color = 'text-green-600';
  let desc = 'Tumbuh kembang anak sesuai dengan usianya.';
  let rec = 'Pertahankan pola makan gizi seimbang dan pantau terus setiap bulan.';

  // Prioritas Deteksi: Stunting (Tinggi) > Gizi Buruk (Berat)
  if (zScoreHeight < -3) {
    status = 'Sangat Pendek (Severely Stunted)';
    color = 'text-red-700';
    desc = 'Tinggi badan sangat jauh di bawah standar. Berisiko gangguan pertumbuhan jangka panjang.';
    rec = 'Segera konsultasikan ke dokter spesialis anak. Perlu intervensi gizi khusus (Tinggi Protein & Mikronutrien).';
  } else if (zScoreHeight < -2) {
    status = 'Pendek (Stunted)';
    color = 'text-orange-600';
    desc = 'Tinggi badan di bawah rata-rata anak seusianya.';
    rec = 'Perbaiki asupan protein hewani (telur, ikan, daging) dan pastikan tidur cukup. Cek juga penyerapan gizi.';
  } else if (zScoreWeight < -3) {
    status = 'Gizi Buruk (Severely Underweight)';
    color = 'text-red-600';
    desc = 'Berat badan sangat kurang. Berbahaya bagi perkembangan otak dan fisik.';
    rec = 'Butuh Makanan Tambahan (PMT) padat kalori segera. Rujuk ke Puskesmas/Dokter.';
  } else if (zScoreWeight < -2) {
    status = 'Gizi Kurang (Underweight)';
    color = 'text-orange-500';
    desc = 'Berat badan kurang dari standar.';
    rec = 'Tambah porsi makan, berikan camilan padat gizi, dan gunakan lemak tambahan (minyak/santan) pada makanan.';
  } else if (zScoreWeight > 2) {
    status = 'Risiko Gizi Lebih';
    color = 'text-yellow-600';
    desc = 'Berat badan di atas rata-rata.';
    rec = 'Kurangi makanan manis/gula. Perbanyak aktivitas fisik bermain.';
  }

  // Hitung BMI sekedar data tambahan
  const heightM = height / 100;
  const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

  return {
    category: 'Balita (0-5 Tahun)',
    bmi,
    zScore: parseFloat(zScoreHeight.toFixed(2)),
    status,
    color,
    description: desc,
    recommendation: rec
  };
}

// ==========================================
// 2. RUMUS KHUSUS DEWASA (> 19 Tahun) - Menggunakan BMI Statis
// ==========================================
function analyzeAdult(weight: number, height: number): AnalysisResult {
  const heightM = height / 100;
  const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

  let status = '';
  let color = '';
  let desc = '';
  let rec = '';

  if (bmi < 18.5) {
    status = 'Kekurangan Berat Badan (Underweight)';
    color = 'text-orange-500';
    desc = 'BMI di bawah 18.5. Tubuh terlalu kurus.';
    rec = 'Tingkatkan asupan kalori dengan makanan padat energi & protein. Latihan beban untuk massa otot.';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    status = 'Berat Badan Normal';
    color = 'text-green-600';
    desc = 'BMI ideal (18.5 - 24.9).';
    rec = 'Pertahankan pola hidup sehat, olahraga rutin 150 menit/minggu.';
  } else if (bmi >= 25 && bmi <= 29.9) {
    status = 'Kelebihan Berat Badan (Overweight)';
    color = 'text-yellow-600';
    desc = 'BMI antara 25 - 29.9.';
    rec = 'Mulai kurangi kalori harian (defisit kalori). Kurangi gorengan dan gula.';
  } else {
    status = 'Obesitas';
    color = 'text-red-600';
    desc = 'BMI di atas 30. Berisiko penyakit metabolik.';
    rec = 'Konsultasi diet. Fokus pada whole foods, perbanyak sayur, dan aktif bergerak setiap hari.';
  }

  return {
    category: 'Dewasa',
    bmi,
    status,
    color,
    description: desc,
    recommendation: rec
  };
}

// ==========================================
// FUNGSI UTAMA (MAIN)
// ==========================================
export const assessNutritionalStatus = (
  ageMonths: number,
  weight: number,
  height: number,
  gender: 'male' | 'female'
): AnalysisResult => {
  
  // LOGIKA PEMBAGIAN KATEGORI
  if (ageMonths <= 60) {
    // 0 - 5 Tahun: Pakai Standar WHO Balita (LMS)
    return analyzeToddler(ageMonths, weight, height, gender);
  } 
  else {
    // Di atas 5 tahun
    // CATATAN: Idealnya 5-19 tahun pakai WHO Reference 2007 (Z-Score juga).
    // Tapi karena kita belum punya datanya, kita anggap masuk fase transisi/dewasa 
    // atau Anda bisa menambahkan logic khusus nanti.
    // Untuk saat ini kita arahkan ke Adult Logic tapi beri catatan.
    
    const result = analyzeAdult(weight, height);
    if (ageMonths < 228) { // Di bawah 19 tahun
       result.category = 'Anak/Remaja (5-19 Tahun)';
       result.description += ' (Catatan: Menggunakan standar BMI umum karena data WHO 2007 belum tersedia).';
    }
    return result;
  }
};

// --- Helper Rumus LMS ---
function calculateLMS(val: number, L: number, M: number, S: number) {
  if (Math.abs(L) < 0.01) return Math.log(val / M) / S;
  return (Math.pow(val / M, L) - 1) / (L * S);
}