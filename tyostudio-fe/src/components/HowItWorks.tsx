const HowItWorks: React.FC = () => {
  const steps = [
    { num: '01', title: 'Input Data', desc: 'Masukkan usia, berat, dan tinggi badan anak ke dalam sistem.' },
    { num: '02', title: 'Analisis Sistem', desc: 'Sistem menghitung status gizi & BMI berdasarkan standar WHO.' },
    { num: '03', title: 'Dapat Rekomendasi', desc: 'Terima saran menu harian yang tepat sasaran untuk si kecil.' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-5 text-center max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">Cara Kerja Aplikasi</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, idx) => (
            <div key={idx} className="relative p-6 group">
              {/* Giant Number Background */}
              <div className="absolute -top-6 left-1/2 min-w-[3ch] -translate-x-1/2 text-8xl font-black text-[var(--secondary-color)]/10 select-none z-0 transition-transform group-hover:scale-110 duration-500">
                {step.num}
              </div>

              <div className="relative z-10 pt-8">
                <h3 className="text-xl font-bold text-[var(--primary-color)] mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;