import React from 'react';

const BiometricSection: React.FC = () => {
  return (
    <section className="container mx-auto px-5 py-16">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
        {/* Bagian Kiri: Placeholder Grafik */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {/* Menggunakan div placeholder untuk grafik */}
          <div className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
            <p className="text-center font-medium">Chart Visualization Placeholder</p>
            <div className="text-xs mt-2 opacity-60">(Recharts Area)</div>
          </div>
        </div>

        {/* Bagian Kanan: Teks */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Pantau <span className="text-[var(--primary-color)]">Tumbuh Kembang</span> <br />
            Secara Real-Time
          </h2>

          <div className="space-y-4 text-gray-600 leading-relaxed text-justify md:text-left">
            <p>
              Visualisasi data biometrik di samping merepresentasikan fluktuasi indeks massa tubuh (BMI)
              dan parameter pertumbuhan dalam kurun waktu 12 bulan terakhir.
            </p>
            <p>
              Sistem mengagregasi data harian untuk membentuk pola tren yang akurat,
              memungkinkan deteksi dini terhadap defisit kalori atau lonjakan berat badan yang tidak wajar.
            </p>
          </div>

          <button className="text-[var(--primary-color)] font-bold hover:text-teal-700 transition-colors flex items-center gap-2">
            Lihat Detail Grafik
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BiometricSection;