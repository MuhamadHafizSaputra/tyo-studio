'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// --- MOCK DATA ---
const recommendedMenu = [
  { id: 1, name: 'Terong Balado', cal: 150, protein: '10g', fats: '5g', img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee397?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Tempe Goreng', cal: 200, protein: '15g', fats: '10g', img: 'https://images.unsplash.com/photo-1628839029670-c75c5e884143?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Ayam Kecap', cal: 300, protein: '25g', fats: '12g', img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Sup Sayur', cal: 120, protein: '5g', fats: '2g', img: 'https://images.unsplash.com/photo-1547592166-23acbe3a624b?auto=format&fit=crop&w=300&q=80' },
];

export default function CheckStuntingPage() {
  // --- STATE ---
  // Simulasi Login: Toggle ini untuk melihat bedanya User Baru vs User Lama
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const [formData, setFormData] = useState({
    age: '',
    gender: 'Laki-laki',
    weight: '',
    height: '',
  });

  const [result, setResult] = useState<{
    zScore: number;
    status: string;
    description: string;
    isStunting: boolean;
  } | null>(null);

  // --- EFFECT: PREFILL DATA JIKA LOGIN ---
  useEffect(() => {
    if (isLoggedIn) {
      // Simulasi: Jika sudah login/signup, data anak diambil dari DB
      setFormData({
        age: '24',
        gender: 'Laki-laki',
        weight: '11.5',
        height: '82',
      });
    } else {
        setFormData({ age: '', gender: 'Laki-laki', weight: '', height: '' });
        setResult(null);
    }
  }, [isLoggedIn]);

  // --- HANDLER ---
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.age || !formData.weight || !formData.height) return;

    // --- LOGIKA SIMULASI Z-SCORE ---
    // Rumus kasar untuk demo: (TinggiAnak - Median) / StdDev
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age); // Bulan
    
    // Median kasar (Age * 0.7 + 60)
    const medianHeight = (age * 0.7) + 60; 
    const stdDev = 3; 

    const zScoreVal = (height - medianHeight) / stdDev;
    const zScoreFixed = parseFloat(zScoreVal.toFixed(1));
    
    let status = 'Tumbuh Kembang Normal';
    let isStunting = false;
    let desc = 'Tinggi badan anak berada dalam rentang normal standar WHO.';

    if (zScoreFixed < -2) {
      status = 'Terindikasi Stunting';
      isStunting = true;
      desc = 'Tinggi badan anak berada di bawah rata-rata standar WHO.';
    } else if (zScoreFixed > 2) {
      status = 'Tinggi Diatas Rata-rata';
      desc = 'Pertumbuhan anak sangat pesat diatas rata-rata.';
    }

    setResult({
      zScore: zScoreFixed,
      status,
      description: desc,
      isStunting
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        
        {/* Toggle Login Simulation (Untuk Demo Developer) */}
        <div className="mb-6 flex items-center gap-2 bg-yellow-100 p-2 rounded w-fit text-xs border border-yellow-200">
          <span className="font-bold">🛠 Dev Mode:</span>
          <button 
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="underline text-yellow-800"
          >
            {isLoggedIn ? 'Switch ke Mode Tamu (Kosong)' : 'Switch ke Mode User (Terisi)'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- LEFT COLUMN: INPUT FORM --- */}
          <div className="w-full lg:w-1/3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 text-xl">
                👤
              </div>
              <h2 className="text-xl font-bold text-gray-800">Data Si Kecil</h2>
            </div>

            <form onSubmit={handleCalculate} className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Umur (Bulan)</label>
                  <input 
                    type="number" 
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all"
                    placeholder="12"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
                  <select 
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
                    <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-400 text-sm">⚖️</span>
                    <input 
                        type="number" 
                        className="w-full pl-9 p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                        placeholder="11"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    />
                    </div>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tinggi Badan (cm)</label>
                    <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-400 text-sm">📏</span>
                    <input 
                        type="number" 
                        className="w-full pl-9 p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                        placeholder="70"
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: e.target.value})}
                    />
                    </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[var(--primary-color)] text-white font-bold py-3.5 rounded-lg hover:bg-teal-600 transition-colors shadow-md mt-2"
              >
                Hitung Sekarang
              </button>
            </form>
          </div>

          {/* --- RIGHT COLUMN: RESULTS & RECOMMENDATIONS --- */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* 1. Result Card (Red/Green Box) */}
            {result ? (
              <div className={`rounded-xl p-6 border-l-4 shadow-sm animate-fade-in ${result.isStunting ? 'bg-[#FFF5F5] border-[#FF5252]' : 'bg-[#E8F5F3] border-[var(--primary-color)]'}`}>
                <div className="flex items-start gap-4">
                  <div className={`mt-1 text-2xl`}>
                    {result.isStunting ? '❗' : 'vf'}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold mb-1 ${result.isStunting ? 'text-[#C0392B]' : 'text-[#00b894]'}`}>
                      {result.status}
                    </h3>
                    <p className="font-bold text-gray-700 mb-2 text-sm">Z-Score: {result.zScore} SD</p>
                    <p className="text-gray-600 text-sm">{result.description}</p>
                  </div>
                </div>
              </div>
            ) : (
                // Empty State
                <div className="h-[200px] flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                    <span className="text-4xl mb-2">📊</span>
                    <p>Hasil analisis akan muncul di sini</p>
                </div>
            )}

            {/* 2. Recommendations & Menus (Muncul setelah ada result) */}
            {result && (
              <div className="animate-fade-in-up space-y-6">
                
                {/* Text Header */}
                <div className="flex items-center gap-2">
                    <span className="text-[var(--primary-color)] text-xl font-bold">Ψ</span>
                    <h3 className="text-lg font-bold text-gray-800">Rekomendasi Menu</h3>
                </div>

                {/* Info Cards (Pink & Orange backgrounds like design) */}
                <div className="grid gap-4">
                  <div className="bg-[#FFF0F0] border border-[#FFDddd] p-4 rounded-lg">
                    <h4 className="font-bold text-[#D32F2F] mb-1 text-sm">Menu Tinggi Protein Hewani</h4>
                    <p className="text-xs text-[#D32F2F] opacity-80">Telur dan Ikan kembung untuk kejar tumbuh.</p>
                  </div>
                  <div className="bg-[#FFF8E1] border border-[#FFECB3] p-4 rounded-lg">
                    <h4 className="font-bold text-[#F57C00] mb-1 text-sm">Pentingnya Zat Besi</h4>
                    <p className="text-xs text-[#F57C00] opacity-80">Cegah anemia yang menghambat pertumbuhan.</p>
                  </div>
                </div>

                {/* Login CTA Bar (Design Green) */}
                {!isLoggedIn && (
                  <div className="bg-[var(--primary-color)] rounded-lg p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                    <div>
                      <h4 className="font-bold text-md">Ingin simpan data ini?</h4>
                      <p className="opacity-90 text-xs">Login untuk melihat grafik perkembangan.</p>
                    </div>
                    <button className="bg-white text-[var(--primary-color)] px-5 py-2 rounded text-sm font-bold hover:bg-gray-50 transition">
                      Login & Track
                    </button>
                  </div>
                )}

                {/* Food Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {recommendedMenu.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-32 w-full">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-md mb-3 text-gray-800">{item.name}</h4>
                        <div className="text-xs space-y-1 text-gray-500">
                          <div className="flex justify-between">
                            <span>{item.cal} Kal</span>
                            <span className="font-medium text-gray-700">20g | 10g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Protein</span>
                            <span className="font-medium text-gray-700">{item.protein} | 5g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fats</span>
                            <span className="font-medium text-gray-700">{item.fats} | 10g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}