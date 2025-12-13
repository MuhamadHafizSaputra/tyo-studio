'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ChefHat,
  LineChart,
  BookOpen,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Clock,
  Wallet,
  Ruler,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from 'recharts';

// Data Dummy untuk Grafik Hero (Visualisasi)
const heroChartData = [
  { month: 'Jan', weight: 8.0 },
  { month: 'Feb', weight: 9.0 },
  { month: 'Mar', weight: 9.2 },
  { month: 'Apr', weight: 9.8 },
  { month: 'May', weight: 10.1 },
  { month: 'Jun', weight: 10.4 },
];

// Data Alasan Bunda Memilih Kami
const reasonsData = [
  {
    icon: Ruler,
    title: "Standar WHO & Kemenkes",
    desc: "Perhitungan status gizi mengikuti kurva pertumbuhan standar dunia yang akurat."
  },
  {
    icon: HeartHandshake,
    title: "Rekomendasi Berbasis AI",
    desc: "Rekomendasi nutrisi berbasis AI dengan kondisi personal si kecil."
  },
  {
    icon: ShieldCheck,
    title: "Data Terjamin Aman",
    desc: "Privasi data tumbuh kembang si kecil adalah prioritas utama kami."
  },
  {
    icon: Sparkles,
    title: "Mudah Digunakan",
    desc: "Antarmuka didesain simpel khusus untuk Bunda yang sibuk mengurus si kecil."
  },
  {
    icon: Clock,
    title: "Akses Kapan Saja",
    desc: "Pantau grafik pertumbuhan 24/7 di mana saja tanpa ribet bawa buku KIA."
  },
  {
    icon: Wallet,
    title: "100% Gratis",
    desc: "Fitur utama pencegahan stunting dapat diakses tanpa biaya langganan."
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-teal-100">

      {/* ================= 1. HERO SECTION (UPDATED) ================= */}
      {/* Menggunakan bg-teal-50 dan Wave Bottom untuk transisi yang soft */}
      <section className="relative bg-teal-50 pt-32 pb-32 lg:pt-28 lg:pb-64 overflow-hidden">
        
        {/* --- Background Animated Blobs --- */}
        {/* Memberikan kesan hidup dan playful di background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

          {/* Text Content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-black text-teal-700 leading-[1.15] tracking-tight">
              Pantau Tumbuh Kembang Si Kecil Tanpa Cemas
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Solusi lengkap pencegahan stunting dengan standar WHO.
              Cek status gizi, catat pertumbuhan, dan dapatkan resep nutrisi dalam satu aplikasi.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/cek-sikecil"
                className="px-8 py-2 bg-[var(--primary-color)] text-white rounded-full font-bold hover:bg-teal-600 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-teal-500/30"
              >
                Cek Status Gizi
              </Link>
              <Link
                href="/login"
                className="px-8 py-2 bg-white border-2 border-teal-100 text-teal-700 rounded-full font-bold hover:bg-teal-50 hover:border-teal-100 transition-all duration-300 shadow-sm"
              >
                Masuk
              </Link>
            </div>
          </div>

          {/* Hero Visual (Interactive Chart Mockup) */}
          <div className="relative">
            <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-teal-900/10 border border-white/50 z-20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-shadow duration-500">
              {/* Header Card */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-1">Pertumbuhan Berat</p>
                  <h3 className="text-3xl font-bold text-gray-900">10.4 <span className="text-lg font-medium text-gray-500">kg</span></h3>
                </div>
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl">
                  👶
                </div>
              </div>

              {/* Chart */}
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={heroChartData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00b894" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#00b894" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="month" hide />

                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      cursor={{ stroke: '#00b894', strokeWidth: 1, strokeDasharray: '4 4' }}
                      formatter={(value) => [`${value} kg`]}
                    />

                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#00b894"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-600">Status Gizi</p>
                  <p className="text-sm font-bold text-gray-800">Normal (Gizi Baik)</p>
                </div>
              </div>
            </div>

            {/* Decoration Behind Card */}
            <div className="absolute top-10 -right-10 w-full h-full bg-teal-200/50 rounded-[2.5rem] -z-10 transform rotate-6 scale-95 opacity-50 blur-sm" />
          </div>
        </div>

        {/* --- WAVE BOTTOM --- */}
        {/* Transisi putih ke section berikutnya */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg 
            className="relative block w-[calc(100%+1.3px)] h-[80px] sm:h-[120px]" 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* ================= 2. ALASAN BUNDA MEMILIH KAMI ================= */}
      <section className="pt-24 pb-24 relative">
        {/* Dekorasi Curve Background */}
        <div className="absolute top-0 left-0 w-full h-[120%] bg-purple-50/30 rounded-br-[150px] -z-10 skew-y-1 transform origin-top-left" />

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Bagian Kiri: Judul */}
            <div className="lg:w-1/3">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-4">
                Alasan Bunda <br /> Memilih Kami
              </h2>
              <p className="text-gray-500 mb-6">
                Kami berkomitmen memberikan yang terbaik untuk mendukung perjalanan mengasuh si kecil.
              </p>
              <div className="h-1.5 w-24 bg-[var(--primary-color)] rounded-full"></div>
            </div>

            {/* Bagian Kanan: Grid Card */}
            <div className="lg:w-2/3 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {reasonsData.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-3 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md hover:border-[var(--primary-color)] transition-all duration-300 flex items-center gap-4 group"
                  >
                    {/* Icon Container */}
                    <div className="shrink-0 w-10 h-10 md:w-14 md:h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-[var(--primary-color)] group-hover:bg-[var(--primary-color)] group-hover:text-white transition-colors duration-300">
                      <item.icon strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-grow">
                      <h4 className="font-bold text-md md:text-base text-gray-800 mb-1">{item.title}</h4>
                      <p className="hidden md:block text-xs text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 3. BENTO GRID FEATURES ================= */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Fitur Lengkap untuk Bunda</h2>
              <p className="text-gray-500">Semua yang Bunda butuhkan untuk memantau kesehatan si kecil ada di sini.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">

            {/* Feature 1: Cek Stunting (Large) */}
            <Link href="/cek-sikecil" className="group md:col-span-2 bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-teal-200 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Cek Status Gizi & Stunting</h3>
                <p className="text-gray-500 max-w-md text-sm md:text-base line-clamp-2">Kalkulator otomatis menggunakan standar WHO (Z-Score) untuk mendeteksi dini risiko stunting pada anak.</p>
              </div>
              <div className="mt-6 flex items-center justify-end md:justify-start text-teal-600 font-bold group-hover:translate-x-1 transition-all duration-300 z-10">
                Mulai Analisis
              </div>
            </Link>

            {/* Feature 2: Cek Nutrisi (Tall) */}
            <Link href="/cek-nutrisi" className="group bg-teal-500 p-5 md:p-8 rounded-3xl shadow-lg shadow-teal-400/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold mb-2">Hitung Nutrisi Harian</h3>
                <p className="text-teal-50 text-sm md:text-base line-clamp-2">Pastikan asupan kalori & protein si kecil terpenuhi setiap hari.</p>
              </div>
              <div className="mt-6 flex items-center justify-end md:justify-start text-teal-50 font-bold group-hover:translate-x-1 transition-all duration-300">
                Mulai Hitung
              </div>
            </Link>
            {/* Feature 3: Visualisasi Grafik (Static Mockup)*/}
            <div className="hidden md:block group bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-teal-200 transition-all duration-300 relative overflow-hidden">
              
              {/* --- Start of inserted mockup code --- */}
              <div className="absolute w-full h-full flex items-center justify-center">
                {/* Main Card UI Mockup */}
                <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-gray-50 w-full">
                  {/* Header Mockup */}
                  <div className="flex items-center justify-between mb-2 pt-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">👶</div>
                      <div>
                        <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 w-12 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Gizi Baik</div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="h-32 bg-gradient-to-b from-white to-gray-50 border border-dashed border-gray-100 rounded-xl flex items-end justify-between p-3 mb-2">
                    <div className="w-6 h-[40%] bg-teal-100 rounded-t-md relative group/chart">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover/chart:opacity-100 transition">8.0kg</div>
                    </div>
                    <div className="w-6 h-[55%] bg-teal-200 rounded-t-md relative group/chart">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover/chart:opacity-100 transition">8.5kg</div>
                    </div>
                    <div className="w-6 h-[65%] bg-teal-300 rounded-t-md relative group/chart">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover/chart:opacity-100 transition">10.0kg</div>
                    </div>
                    <div className="w-6 h-[75%] bg-teal-400 rounded-t-md relative group/chart">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover/chart:opacity-100 transition">11.0kg</div>
                    </div>
                    <div className="w-6 h-[85%] bg-[var(--primary-color)] rounded-t-md relative group/chart">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover/chart:opacity-100 transition">12.5kg</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- End of inserted mockup code --- */}
            </div>

            {/* Feature 4: Edukasi */}
            <Link href="/track" className="group md:col-span-2 bg-white text-left md:text-right p-5 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-teal-200 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute down-0 left-0 w-64 h-64 bg-teal-50 rounded-full -ml-16 -mb-16 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Track Tumbuh Kembang si Kecil</h3>
                <p className="text-gray-500 max-w-md ml-auto text-sm md:text-base line-clamp-2">Pantau riwayat tinggi dan berat badan anak dalam grafik interaktif yang mudah dibaca.</p>
              </div>
              <div className="mt-6 flex items-center justify-end text-teal-600 font-bold group-hover:translate-x-[-4px] transition-all duration-300 z-10">
                Mulai Track
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ================= 4. CTA FOOTER ================= */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-2 md:px-6">
          <div className="bg-teal-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Abstract Shapes */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-teal-200 rounded-full blur-[100px] opacity-40"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-300 rounded-full blur-[100px] opacity-70"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                Mulai Perjalanan Sehat <br /> Si Kecil Hari Ini
              </h2>
              <p className="text-teal-50 text-sm md:text-lg lg:text-xl mb-10">
                Bergabunglah dengan ribuan orang tua lainnya yang telah mempercayakan pemantauan tumbuh kembang anak pada Teman Ibu.
              </p>
              <Link
                href="/register"
                className="inline-block px-10 py-3 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}