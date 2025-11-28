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
    <div className="app">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Section 1: Fitur Utama (Menjelaskan 4 poin utama aplikasi) */}
        <Features />

        {/* Section 2: Preview Output (Visualisasi Grafik BMI/Stunting) */}
        {/* Kita beri background putih agar kontras dengan section Features */}
        <div style={{ backgroundColor: '#fff' }}>
          <BiometricSection />
        </div>

        {/* Section 3: Saran Nutrisi (Implementasi fitur saran makanan) */}
        <section className="container" style={{ padding: '80px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
              Rekomendasi Menu Harian
            </h2>
            <p style={{ color: '#666', marginTop: '10px' }}>
              Contoh saran makanan berdasarkan hasil perhitungan kebutuhan kalori anak.
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '30px' 
          }}>
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
        <section style={{ 
          backgroundColor: 'var(--primary-color)', 
          padding: '60px 20px', 
          textAlign: 'center',
          color: 'white',
          borderRadius: '20px',
          margin: '40px 20px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '28px' }}>Siap Memantau Tumbuh Kembang Anak?</h2>
          <p style={{ marginBottom: '30px', opacity: 0.9 }}>
            Daftar sekarang dan dapatkan akses ke kalkulator stunting serta jurnal nutrisi harian.
          </p>
          <button style={{
            backgroundColor: 'var(--secondary-color)',
            color: 'white',
            border: 'none',
            padding: '12px 35px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '50px',
            cursor: 'pointer'
          }}>
            Mulai Gratis
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;