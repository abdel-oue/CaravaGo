import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import VehicleTypes from '../components/home/VehicleTypes';
import Destinations from '../components/home/Destinations';
import Community from '../components/home/Community';
import Newsletter from '../components/home/Newsletter';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-bgLight">
      <Navbar />

      <main>
        <Hero />
        {/* Features contains the 3-card overlap section */}
        <Features />

        <VehicleTypes />
        <Destinations />
        <Community />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default Home;