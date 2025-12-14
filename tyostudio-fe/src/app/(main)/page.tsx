import Hero from '../../components/Hero';

function LandingPage() {

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        <Hero />
      </main>
    </div>
  );
}

export default LandingPage;