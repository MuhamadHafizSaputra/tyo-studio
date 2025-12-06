const Features: React.FC = () => {
  const features = [
    {
      icon: "👶",
      title: "Data Anak Terpusat",
      desc: "Simpan riwayat tinggi dan berat badan anak secara berkala untuk memantau grafik pertumbuhannya."
    },
    {
      icon: "📈",
      title: "Standar WHO",
      desc: "Perhitungan BMI dan deteksi risiko stunting menggunakan standar kurva pertumbuhan resmi dari WHO."
    },
    {
      icon: "🥗",
      title: "Saran Nutrisi Harian",
      desc: "Dapatkan rekomendasi resep dan bahan makanan yang disesuaikan dengan kebutuhan kalori anak."
    },
    {
      icon: "📝",
      title: "Jurnal Makanan",
      desc: "Catat asupan nutrisi harian untuk memastikan makronutrien (Protein, Karbo, Lemak) terpenuhi."
    }
  ];

  return (
    <section className="container mx-auto px-5 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-color)] mb-3">Fitur Unggulan Kami</h2>
        <p className="text-gray-600 text-base md:text-lg">Solusi lengkap untuk mencegah stunting sejak dini</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((item, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-2xl mb-6 text-[var(--primary-color)] group-hover:bg-teal-100 transition-colors">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;