'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Activity,
  ChefHat,
  LineChart,
  BookOpen,
  Check,
  Star,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Clock,
  Wallet,
  Ruler,
  ChevronRight,
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

// Data Alasan Bunda Memilih Kami (Untuk Section Baru)
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

// Data Fitur Unggulan (Untuk Section Bento Grid / Features)
const features = [
  {
    href: '/cek-sikecil',
    icon: <Ruler size={24} />,
    title: 'Cek Status Gizi',
    desc: 'Pantau pertumbuhan anak & deteksi stunting dini',
    color: 'bg-teal-500',
  },
  {
    href: '/cek-nutrisi',
    icon: <ChefHat size={24} />,
    title: 'Rekomendasi Nutrisi',
    desc: 'Resep sehat harian sesuai kebutuhan kalori',
    color: 'bg-green-500',
  },
  {
    href: '/track',
    icon: <LineChart size={24} />,
    title: 'Pantau Grafik',
    desc: 'Visualisasi data tumbuh kembang yang akurat',
    color: 'bg-purple-500',
  },
  {
    href: '/artikel',
    icon: <BookOpen size={24} />,
    title: 'Artikel & Edukasi',
    desc: 'Tips parenting & kesehatan dari ahli',
    color: 'bg-blue-500',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-teal-100">

      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative pt-12 pb-20 mt-10 mb-10 overflow-hidden">
        {/* Background Blob Dekorasi */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">

            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.15] tracking-tight">
              Pantau Tumbuh <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-teal-400">
                Kembang Si Kecil
              </span> <br />
              Tanpa Cemas
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              Solusi lengkap pencegahan stunting dengan standar WHO.
              Cek status gizi, catat pertumbuhan, dan dapatkan resep nutrisi dalam satu aplikasi.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/cek-sikecil"
                className="px-8 py-4 bg-[var(--primary-color)] text-white rounded-full font-bold hover:bg-teal-600 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Cek Status Gizi
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-full font-bold hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-300"
              >
                Masuk
              </Link>
            </div>
          </div>

          {/* Hero Visual (Interactive Chart Mockup) */}
          <div className="relative">
            <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-100 z-20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-shadow duration-500">
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
            <div className="absolute top-10 -right-10 w-full h-full bg-gray-100 rounded-[2.5rem] -z-10 transform rotate-6 scale-95 opacity-50" />
          </div>
        </div>
      </section>

      {/* ================= 2. ALASAN BUNDA MEMILIH KAMI (NEW) ================= */}
      <section className="py-24 relative">
        {/* Dekorasi Curve Background ala Gambar Referensi */}
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
                    className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md hover:border-[var(--primary-color)] transition-all duration-300 flex items-center gap-4 group"
                  >
                    {/* Icon Container */}
                    <div className="shrink-0 w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-[var(--primary-color)] group-hover:bg-[var(--primary-color)] group-hover:text-white transition-colors duration-300">
                      <item.icon size={26} strokeWidth={1.5} />
                    </div>

                    {/* Text Content */}
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 3. BENTO GRID FEATURES ================= */}
      <section className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Fitur Lengkap untuk Bunda</h2>
              <p className="text-gray-500">Semua yang Bunda butuhkan untuk memantau kesehatan si kecil ada di sini.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">

            {/* Feature 1: Cek Stunting (Large) */}
            <Link href="/cek-sikecil" className="group md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-teal-200 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Cek Status Gizi & Stunting</h3>
                <p className="text-gray-500 max-w-md">Kalkulator otomatis menggunakan standar WHO (Z-Score) untuk mendeteksi dini risiko stunting pada anak.</p>
              </div>
              <div className="mt-6 flex items-center text-teal-600 font-bold group-hover: transition-all duration-300">
                Mulai Analisis
              </div>
            </Link>

            {/* Feature 2: Cek Nutrisi (Tall) */}
            <Link href="/cek-nutrisi" className="group bg-teal-500 p-8 rounded-3xl shadow-lg shadow-teal-400/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Hitung Nutrisi Harian</h3>
                <p className="text-teal-50 text-sm">Pastikan asupan kalori & protein si kecil terpenuhi setiap hari.</p>
              </div>
              <div className="mt-6 flex items-center text-teal-50 font-bold group-hover: transition-all duration-300">
                Mulai Hitung
              </div>
            </Link>

            {/* Feature 3: Visualisasi Grafik (Static Mockup) - UPDATED */}
            {/* Ini sekarang adalah DIV biasa, bukan Link, jadi tidak bisa diklik */}
            <div className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-teal-200 transition-all duration-300 relative overflow-hidden">
              {/* --- Start of inserted mockup code --- */}
              <div className="absolute w-full h-full flex items-center justify-center">
                {/* Decorative Blob */}
                {/* <div className="absolute -inset-4 bg-gradient-to-r from-teal-200 to-blue-200 rounded-[2rem] blur-xl opacity-30 animate-pulse pointer-events-none"></div> */}

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

            {/* Feature 4: Edukasi (Medium) */}
            <Link href="/track" className="group md:col-span-2 bg-white text-right p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-teal-200 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute down-0 left-0 w-64 h-64 bg-teal-50 rounded-full -ml-16 -mb-16 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Track Tumbuh Kembang si Kecil</h3>
                <p className="text-gray-500 max-w-md ml-auto">Pantau riwayat tinggi dan berat badan anak dalam grafik interaktif yang mudah dibaca.</p>
              </div>
              <div className="mt-6 flex items-center justify-end text-teal-600 font-bold group-hover: transition-all duration-300">
                Mulai Track
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ================= 4. CTA FOOTER ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-[var(--primary-color)] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Abstract Shapes */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-teal-200 rounded-full blur-[100px] opacity-40"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-300 rounded-full blur-[100px] opacity-70"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Mulai Perjalanan Sehat <br /> Si Kecil Hari Ini
              </h2>
              <p className="text-teal-50 text-lg mb-10">
                Bergabunglah dengan ribuan orang tua lainnya yang telah mempercayakan pemantauan tumbuh kembang anak pada Teman Ibu.
              </p>
              <Link
                href="/register"
                className="inline-block px-10 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
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