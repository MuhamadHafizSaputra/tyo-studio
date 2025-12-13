import Hero from '../../components/Hero';
import Features from '../../components/Features'; // Komponen Baru
import FoodCard from '../../components/FoodCard';
import BiometricSection from '../../components/BiometricSection';
import HowItWorks from '../../components/HowItWorks'; // Komponen Baru

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
      <main className="flex-grow">
        <Hero />
      </main>
    </div>
  );
}

export default LandingPage;