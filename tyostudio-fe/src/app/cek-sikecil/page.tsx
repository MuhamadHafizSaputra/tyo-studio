'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// --- 1. DEFINISI TIPE DATA (FIXED) ---
type StandardData = Record<number, number>; 

type WhoStandardsType = {
  height: StandardData;
  weight: StandardData;
  bmi: StandardData;
};

// --- 2. DATA MOCKUP STANDARD WHO (SIMULASI LAKI-LAKI) ---
const WHO_STANDARDS_MALE: WhoStandardsType = {
  height: { 
    0: 49.9, 6: 67.6, 12: 75.7, 18: 82.3, 24: 87.8, 
    36: 96.1, 48: 103.3, 60: 110.0 
  },
  weight: { 
    0: 3.3, 6: 7.9, 12: 9.6, 18: 10.9, 24: 12.2, 
    36: 14.3, 48: 16.3, 60: 18.3 
  },
  bmi: { 
    0: 13.4, 6: 17.2, 12: 16.9, 18: 16.0, 24: 16.0, 
    36: 15.6, 48: 15.3, 60: 15.2 
  }
};

const recommendedMenu = [
  { id: 1, name: 'Sop Ikan Gabus', cal: 150, protein: 'Tinggi Albumin', desc: 'Mempercepat pertumbuhan jaringan.', img: 'https://images.unsplash.com/photo-1623851722837-d2a84a25036f?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Telur Puyuh Rebus', cal: 200, protein: 'Protein Hewani', desc: 'Mudah dicerna & padat gizi.', img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee397?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Nugget Tempe Ayam', cal: 300, protein: 'Protein Nabati+Hewani', desc: 'Variasi lauk agar tidak bosan.', img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=300&q=80' },
];

export default function CheckStuntingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const [formData, setFormData] = useState({
    dob: '',
    measureDate: new Date().toISOString().split('T')[0],
    gender: 'Laki-laki',
    weight: '',
    height: '',
  });

  // Update tipe state result untuk menyimpan nilai Z-Score
  const [result, setResult] = useState<{
    ageString: string;
    bmi: string;
    zHeight: string; // Ditambahkan
    zWeight: string; // Ditambahkan
    zBmi: string;    // Ditambahkan
    statusWeight: { text: string; color: string; bg: string };
    statusHeight: { text: string; color: string; bg: string };
    statusBmi: { text: string; color: string; bg: string };
    advice: string;
  } | null>(null);

  // --- EFFECT: PREFILL DATA ---
  useEffect(() => {
    if (isLoggedIn) {
      setFormData({
        dob: '2022-06-15', 
        measureDate: new Date().toISOString().split('T')[0],
        gender: 'Laki-laki',
        weight: '13.4', // Contoh input
        height: '86',   // Contoh input
      });
    } else {
        setFormData({ 
            dob: '', 
            measureDate: new Date().toISOString().split('T')[0],
            gender: 'Laki-laki', 
            weight: '', 
            height: '' 
        });
        setResult(null);
    }
  }, [isLoggedIn]);

  // --- HELPER 1: HITUNG UMUR ---
  const calculateAgeDetail = (dob: string, measureDate: string) => {
    const birth = new Date(dob);
    const measure = new Date(measureDate);
    
    let years = measure.getFullYear() - birth.getFullYear();
    let months = measure.getMonth() - birth.getMonth();
    let days = measure.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonthDate = new Date(measure.getFullYear(), measure.getMonth(), 0);
      days += prevMonthDate.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const totalMonths = (years * 12) + months;
    return { 
        totalMonths, 
        string: `${years} Tahun ${months} Bulan ${days} Hari` 
    };
  };

  // --- HELPER 2: LOGIKA Z-SCORE ---
  const getZScoreStatus = (value: number, ageMonths: number, type: keyof WhoStandardsType) => {
    const standardData = WHO_STANDARDS_MALE[type];
    const availableAges = Object.keys(standardData).map(Number);
    
    // Cari umur terdekat
    const closestAge = availableAges.reduce((prev, curr) => 
      Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev
    );
    
    const median = standardData[closestAge];
    
    // Simulasi SD
    let sdValue = 0;
    if (type === 'weight') sdValue = median * 0.12;
    else if (type === 'height') sdValue = median * 0.04;
    else sdValue = 1.5;

    return (value - median) / sdValue;
  };

  // --- HELPER 3: GENERATE STATUS ---
  const getStatusLabel = (zScore: number, type: 'height' | 'weight' | 'bmi') => {
    let status = { text: 'Normal', color: 'text-green-700', bg: 'bg-green-100' };

    if (type === 'height') {
        if (zScore < -3) status = { text: 'Sangat Pendek', color: 'text-red-700', bg: 'bg-red-100' };
        else if (zScore < -2) status = { text: 'Pendek (Stunting)', color: 'text-red-600', bg: 'bg-red-50' };
        else if (zScore > 2) status = { text: 'Tinggi', color: 'text-blue-700', bg: 'bg-blue-100' };
    } 
    else if (type === 'weight') {
        if (zScore < -3) status = { text: 'Sangat Kurang', color: 'text-red-700', bg: 'bg-red-100' };
        else if (zScore < -2) status = { text: 'Berat Kurang', color: 'text-orange-700', bg: 'bg-orange-100' };
        else if (zScore > 1) status = { text: 'Risiko Lebih', color: 'text-yellow-700', bg: 'bg-yellow-100' };
        else if (zScore > 2) status = { text: 'Gizi Lebih', color: 'text-red-600', bg: 'bg-red-100' };
    }
    else if (type === 'bmi') {
        if (zScore < -3) status = { text: 'Gizi Buruk', color: 'text-red-700', bg: 'bg-red-100' };
        else if (zScore < -2) status = { text: 'Gizi Kurang', color: 'text-orange-700', bg: 'bg-orange-100' };
        else if (zScore > 1) status = { text: 'Risiko Gizi Lebih', color: 'text-yellow-800', bg: 'bg-yellow-100' };
        else if (zScore > 2) status = { text: 'Gizi Lebih', color: 'text-red-600', bg: 'bg-red-100' };
        else if (zScore > 3) status = { text: 'Obesitas', color: 'text-red-800', bg: 'bg-red-200' };
    }
    return status;
  };

  // --- HANDLER UTAMA ---
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dob || !formData.weight || !formData.height) return;

    const { totalMonths, string: ageStr } = calculateAgeDetail(formData.dob, formData.measureDate);
    
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const heightM = height / 100;
    const bmiVal = weight / (heightM * heightM);
    
    const zHeight = getZScoreStatus(height, totalMonths, 'height');
    const zWeight = getZScoreStatus(weight, totalMonths, 'weight');
    const zBmi = getZScoreStatus(bmiVal, totalMonths, 'bmi');

    const statHeight = getStatusLabel(zHeight, 'height');
    const statWeight = getStatusLabel(zWeight, 'weight');
    const statBmi = getStatusLabel(zBmi, 'bmi');

    let adviceText = "Status gizi anak terpantau baik. Pertahankan pola makan bergizi seimbang.";
    if (zHeight < -2) adviceText = "Si Kecil terindikasi Stunting. Fokus pada perbaikan asupan protein hewani (telur, ikan, daging) dan segera konsultasi ke dokter anak.";
    else if (zBmi > 2) adviceText = "Berat badan anak berlebih. Kurangi makanan manis dan perbanyak aktivitas fisik.";
    else if (zBmi < -2) adviceText = "Berat badan kurang. Tingkatkan asupan kalori dan lemak sehat.";

    setResult({
      ageString: ageStr,
      bmi: bmiVal.toFixed(1),
      zHeight: zHeight.toFixed(2), // Simpan Z-Score Tinggi
      zWeight: zWeight.toFixed(2), // Simpan Z-Score Berat
      zBmi: zBmi.toFixed(2),       // Simpan Z-Score BMI
      statusHeight: statHeight,
      statusWeight: statWeight,
      statusBmi: statBmi,
      advice: adviceText
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        
        {/* Toggle Login Simulation */}
        <div className="mb-6 flex items-center gap-2 bg-yellow-100 p-2 rounded w-fit text-xs border border-yellow-200">
          <span className="font-bold">🛠 Dev Mode:</span>
          <button 
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="underline text-yellow-800"
          >
            {isLoggedIn ? 'Switch ke Mode Tamu' : 'Switch ke Mode User'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- KOLOM KIRI: FORM INPUT --- */}
          <div className="w-full lg:w-1/3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 text-xl">
                📝
              </div>
              <h2 className="text-xl font-bold text-gray-800">Kalkulator Gizi</h2>
            </div>

            <form onSubmit={handleCalculate} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tanggal Lahir</label>
                    <input 
                        type="date" 
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none text-sm"
                        value={formData.dob}
                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tgl Ukur</label>
                    <input 
                        type="date" 
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none text-sm"
                        value={formData.measureDate}
                        onChange={(e) => setFormData({...formData, measureDate: e.target.value})}
                        required
                    />
                  </div>
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Jenis Kelamin</label>
                  <div className="flex gap-3">
                    <label className={`flex-1 p-2.5 rounded-lg border cursor-pointer text-center text-sm font-medium transition ${formData.gender === 'Laki-laki' ? 'border-[var(--primary-color)] bg-teal-50 text-[var(--primary-color)]' : 'border-gray-200 text-gray-500'}`}>
                        <input type="radio" name="gender" value="Laki-laki" className="hidden" onClick={() => setFormData({...formData, gender: 'Laki-laki'})} />
                        👦 Laki-laki
                    </label>
                    <label className={`flex-1 p-2.5 rounded-lg border cursor-pointer text-center text-sm font-medium transition ${formData.gender === 'Perempuan' ? 'border-pink-400 bg-pink-50 text-pink-500' : 'border-gray-200 text-gray-500'}`}>
                        <input type="radio" name="gender" value="Perempuan" className="hidden" onClick={() => setFormData({...formData, gender: 'Perempuan'})} />
                        👧 Perempuan
                    </label>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Berat (kg)</label>
                    <input 
                        type="number" 
                        step="0.1"
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                        placeholder="0.0"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tinggi (cm)</label>
                    <input 
                        type="number" 
                        step="0.1"
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                        placeholder="0.0"
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: e.target.value})}
                    />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[var(--primary-color)] text-white font-bold py-3.5 rounded-lg hover:bg-teal-600 transition-colors shadow-lg shadow-teal-100 mt-2"
              >
                Cek Status Gizi
              </button>
            </form>
          </div>

          {/* --- KOLOM KANAN: HASIL ANALISIS --- */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {result ? (
              <div className="space-y-6 animate-fade-in">
                
                {/* 1. Header Umur */}
                <div className="bg-[#00b894] text-white p-6 rounded-2xl shadow-lg w-full">
                    <p className="opacity-90 text-sm mb-1 font-medium">Usia Saat Diukur</p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{result.ageString}</h2>
                </div>

                {/* 2. Grid Hasil 3 Kartu (UPDATED: MENAMPILKAN Z-SCORE) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Kartu 1: BB/U */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-48">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">BERAT BADAN / UMUR</p>
                        <div>
                            {/* TAMPILKAN NILAI Z-SCORE */}
                            <h4 className="text-3xl font-bold text-gray-800 mb-1">
                                {result.zWeight} <span className="text-sm font-normal text-gray-500">SD</span>
                            </h4>
                            <span className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-bold ${result.statusWeight.bg} ${result.statusWeight.color}`}>
                                {result.statusWeight.text}
                            </span>
                        </div>
                    </div>

                    {/* Kartu 2: TB/U (Stunting) */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-48">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">TINGGI / UMUR (STUNTING)</p>
                        <div>
                             {/* TAMPILKAN NILAI Z-SCORE */}
                            <h4 className="text-3xl font-bold text-gray-800 mb-1">
                                {result.zHeight} <span className="text-sm font-normal text-gray-500">SD</span>
                            </h4>
                            <span className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-bold ${result.statusHeight.bg} ${result.statusHeight.color}`}>
                                {result.statusHeight.text}
                            </span>
                        </div>
                    </div>

                    {/* Kartu 3: IMT/U */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-48">
                        <div className="flex justify-between items-start">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">IMT / UMUR</p>
                        </div>
                        <div>
                            <h4 className="text-3xl font-bold text-gray-800 mb-1">{result.bmi}</h4>
                            {/* TAMPILKAN NILAI Z-SCORE KECIL DI BAWAH BMI */}
                            <p className="text-xs text-gray-500 mb-3 font-medium">Z-Score: {result.zBmi} SD</p>
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${result.statusBmi.bg} ${result.statusBmi.color}`}>
                                {result.statusBmi.text}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Rekomendasi / Saran */}
                <div className="bg-orange-50 border-l-4 border-orange-400 p-5 rounded-r-xl mt-6">
                    <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                        📋 Catatan Penting
                    </h4>
                    <p className="text-orange-700 text-sm leading-relaxed">
                        {result.advice}
                    </p>
                </div>

                {/* 4. Menu Rekomendasi */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Menu Pilihan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recommendedMenu.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                        <div className="h-32 w-full bg-gray-200">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-sm text-gray-800 mb-1">{item.name}</h4>
                            <p className="text-xs text-[var(--primary-color)] font-semibold mb-2">{item.protein}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

              </div>
            ) : (
                // Empty State
                <div className="h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-4xl">
                        ⚖️
                    </div>
                    <p className="text-lg font-medium text-gray-500">Hasil analisis belum tersedia</p>
                    <p className="text-sm opacity-60 mt-1">Silakan lengkapi data si kecil di sebelah kiri</p>
                </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}