import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features'; // Komponen Baru
import FoodCard from '../components/FoodCard';
import BiometricSection from '../components/BiometricSection';
import HowItWorks from '../components/HowItWorks'; // Komponen Baru
import Footer from '../components/Footer';

function LandingPage() {
  // Data dummy saran nutrisi 
  const recommendedMeals = [
    { id: 1, name: 'Sop Ikan Batam', image: 'https://images.unsplash.com/photo-1623851722837-d2a84a25036f?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Bubur Kacang Ijo', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Tumis Brokoli Tempe', image: 'https://images.unsplash.com/photo-1628839029670-c75c5e884143?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Puree Alpukat', image: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Hero />

        {/* Section 1: Fitur Utama */}
        <Features />

        {/* Section 2: Preview Output */}
        <div className="bg-white">
          <BiometricSection />
        </div>

        {/* Section 3: Saran Nutrisi */}
        <section className="container mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-color)] mb-4">
              Rekomendasi Menu Harian
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Contoh saran makanan berdasarkan hasil perhitungan kebutuhan kalori anak.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendedMeals.map((item) => (
              <FoodCard
                key={item.id}
                name={item.name}
                imageSrc={item.image}
              />
            ))}
          </div>
        </section>

        {/* Section 4: Cara Kerja */}
        <HowItWorks />

        {/* Section 5: CTA (Call to Action) */}
        <section className="container mx-auto px-5">
          <div className="bg-[var(--primary-color)] text-white text-center py-16 px-6 rounded-3xl mx-auto max-w-5xl shadow-2xl shadow-teal-200">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Memantau Tumbuh Kembang Anak?</h2>
            <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto">
              Daftar sekarang dan dapatkan akses ke kalkulator stunting serta jurnal nutrisi harian.
            </p>
            <button className="bg-[var(--secondary-color)] text-white border-0 px-10 py-4 text-lg font-bold rounded-full cursor-pointer hover:bg-rose-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-rose-400/30">
              Mulai Gratis
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;