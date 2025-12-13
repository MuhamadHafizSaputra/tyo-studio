import Hero from '../../components/Hero';
import Features from '../../components/Features';
import FoodCard from '../../components/FoodCard';
import BiometricSection from '../../components/BiometricSection';
import HowItWorks from '../../components/HowItWorks';
import Link from 'next/link'; // Jangan lupa import Link

function LandingPage() {
  const recommendedMeals = [
    { id: 1, name: 'Sop Ikan Batam', image: 'https://images.unsplash.com/photo-1623851722837-d2a84a25036f?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Bubur Kacang Ijo', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Tumis Brokoli Tempe', image: 'https://images.unsplash.com/photo-1628839029670-c75c5e884143?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Puree Alpukat', image: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        <Hero />
        
        {/* Visualisasi Data agar user paham output aplikasi */}
        <div className="bg-gray-50">
           <BiometricSection />
        </div>

        <HowItWorks />
        <Features />

        {/* Preview Makanan untuk menarik minat ibu-ibu */}
        <section className="container mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Inspirasi Menu Sehat
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Contoh menu gizi seimbang yang direkomendasikan sistem kami.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendedMeals.map((item) => (
              <FoodCard key={item.id} name={item.name} imageSrc={item.image} />
            ))}
          </div>
        </section>

        {/* CTA Penting untuk konversi user */}
        <section className="container mx-auto px-5 mb-24">
          <div className="bg-[var(--primary-color)] text-white text-center py-16 px-6 rounded-[3rem] mx-auto max-w-5xl shadow-xl shadow-teal-700/20 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Memantau Tumbuh Kembang Anak?</h2>
              <p className="text-lg text-teal-50 mb-10 max-w-2xl mx-auto">
                Daftar sekarang gratis dan dapatkan akses penuh ke fitur deteksi dini stunting.
              </p>
              <Link href="/register" className="inline-block bg-white text-[var(--primary-color)] border-0 px-10 py-4 text-lg font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
                Mulai Sekarang
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;