import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="container mx-auto px-5 py-20 flex flex-col items-center text-center">
      <div className="max-w-3xl">
        {/* Badge */}
        <div className="inline-block px-4 py-1.5 mb-6 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold">
          Dukung Tumbuh Kembang Anak
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Cegah Stunting dengan <br className="hidden md:block" />
          <span className="text-teal-600">Nutrisi Terukur & Tepat</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
          Pantau status gizi anak berdasarkan standar WHO. Dapatkan perhitungan BMI akurat 
          dan rekomendasi menu harian yang dipersonalisasi untuk si kecil.
        </p>

        {/* Button Group */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-rose-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all duration-300">
            Cek Status Gizi Sekarang
          </button>
          
          <button className="bg-transparent text-teal-600 border-2 border-teal-600 px-8 py-3.5 rounded-full font-bold hover:bg-teal-50 transition-all duration-300">
            Pelajari Selengkapnya
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;