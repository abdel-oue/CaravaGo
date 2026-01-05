import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../public/heroimgtesst.jpg';
import logo from '../public/logo.png';

const Home = () => {
  const { user, logout } = useAuth();

  const vehicleTypes = [
    {
      name: 'Campervan',
      description: 'Discreet & fun',
      detail: 'A campervan is accessible and agile. Ideal for outdoor stays and renters who want to feel closer to nature.',
      link: '#',
    },
    {
      name: 'Large campervan',
      description: 'Exotic & autonomous',
      detail: 'Perfect for couples and short family road trips, the large campervan rhymes with practicality. Handy and compact, it will take you everywhere.',
      link: '#',
    },
    {
      name: 'Low profile motorhome',
      description: 'Compact & equipped',
      detail: 'The most compact vehicle of all with all the necessary equipment. A little bonus? Its aerodynamic shape is slightly better for your wallet and the planet.',
      link: '#',
    },
    {
      name: 'Coachbuilt motorhome',
      description: 'Family-friendly & comfortable',
      detail: 'Great comfort for larger crews! A coachbuilt offers you a real taste of freedom while allowing you autonomy during your getaways. Kids will love it.',
      link: '#',
    },
  ];

  const destinations = [
    { name: 'Chianti', location: 'Florence' },
    { name: 'Playa de Benijo', location: 'Tenerife' },
    { name: 'Peak District', location: 'Manchester' },
    { name: 'Neuschwanstein Castle', location: 'Bavaria' },
    { name: 'Coastal Route', location: 'Portugal' },
    { name: 'Mountain Pass', location: 'Switzerland' },
  ];

  const cities = [
    'Paris', 'Málaga', 'London', 'Edinburgh', 'Lisbon', 'Rome', 'Barcelona', 'Dublin',
  ];

  const countries = [
    'Netherlands', 'Belgium', 'Germany', 'Ireland', 'Switzerland', 'Italy', 'Spain', 'United Kingdom', 'France', 'Austria', 'Portugal',
  ];

  const features = [
    {
      icon: '⭐',
      text: 'Rated 4.9/5 with 369,684 reviews',
    },
    {
      icon: '🚐',
      text: 'The largest selection of vehicles in Europe',
    },
    {
      icon: '🌍',
      text: 'Departing trips from Europe or elsewhere',
    },
    {
      icon: '🛡️',
      text: 'Insurance and breakdown assistance included',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src={logo} 
                  alt="CaravaGo" 
                  className="h-36 w-auto"
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#download" className="text-black hover:text-main transition-colors text-sm">Download the app</a>
              <a href="#create-listing" className="text-black hover:text-main transition-colors text-sm">Create a listing</a>
              <a href="#help" className="text-black hover:text-main transition-colors text-sm">Help</a>
              {user ? (
                <>
                  <span className="text-black text-sm">Welcome, {user.name}</span>
                  <button
                    onClick={logout}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="text-black hover:text-main transition-colors text-sm">Sign in</Link>
                  <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm font-medium">Sign up</Link>
                </>
              )}
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-main text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text and Search */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Choose your route, Travel your way
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">RV rental marketplace</p>
              
              {/* Search Form */}
              <div className="bg-white rounded-lg shadow-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Where?</label>
                    <input
                      type="text"
                      placeholder="Pick-up location"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-main focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Your travel dates</label>
                    <input
                      type="text"
                      placeholder="Departure/Return"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-main focus:border-transparent"
                    />
                  </div>
                </div>
                <button className="w-full mt-4 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors font-medium text-lg">
                  Search
                </button>
              </div>

              {/* Decorative stamp */}
              <div className="mt-8 flex items-center justify-start">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded border border-white/20">
                  <span className="text-white/80 text-sm">WITH LOVE FROM CARAVAGO EST. 2024</span>
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:block">
              <div className="bg-main-light rounded-lg h-full min-h-[500px] overflow-hidden relative">
                <img 
                  src={heroImage} 
                  alt="RV rental adventure in the mountains" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Rating display */}
          <div className="mt-12 flex items-center justify-center lg:justify-start space-x-2">
            <div className="flex items-center">
              <span className="text-3xl font-bold">4.9</span>
              <span className="text-xl ml-1">/5</span>
            </div>
            <span className="text-white/80">with</span>
            <span className="font-semibold">369,245 reviews</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <p className="text-base font-medium text-main">{feature.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-12 text-black/70 text-lg">
            The motorhome is the best way to travel without breaking the bank!
          </p>
          <div className="text-center mt-4">
            <a href="#deals" className="text-main hover:text-main-dark font-medium inline-flex items-center">
              All the best deals
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Your reviews on CaravaGo, a never-ending story
            </h2>
            <div className="flex items-center justify-center space-x-3 mb-2">
              <span className="text-4xl text-primary">★★★★★</span>
              <span className="text-3xl font-bold text-main">4.9/5</span>
            </div>
            <p className="text-black/70 text-lg">
              That's how our users rate CaravaGo! Rated 4.9 with 369,245 reviews
            </p>
          </div>
        </div>
      </section>

      {/* Owner CTA */}
      <section className="py-16 bg-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Are you an owner?</h2>
          <p className="text-lg text-black/70 mb-8 max-w-2xl mx-auto">
            Hire and make the most of your vehicle with complete confidence
          </p>
          <a href="#owner" className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark transition-colors font-medium text-lg">
            Find out more
            <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Vehicle Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">Choose the right vehicle</h2>
          <p className="text-center text-black/70 mb-12 max-w-3xl mx-auto text-lg">
            Looking for a motorhome or a campervan? Asking yourself the right questions before hiring a motorhome, campervan or large campervan is the key to a stress-free road trip. There is a perfect vehicle for any travel plan. Don't worry, we'll introduce you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicleTypes.map((vehicle, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-main bg-white"
              >
                <h3 className="text-xl font-semibold text-black mb-2">{vehicle.name}</h3>
                <p className="text-primary font-medium mb-3">{vehicle.description}</p>
                <p className="text-black/70 text-sm mb-4 leading-relaxed">{vehicle.detail}</p>
                <a href={vehicle.link} className="text-main hover:text-main-dark font-medium text-sm inline-flex items-center">
                  Rent a {vehicle.name.toLowerCase()}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 bg-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">Our destinations</h2>
          <p className="text-center text-black/70 mb-12 max-w-3xl mx-auto text-lg">
            In a motorhome? Anything is possible. Nothing is easier than hitting the road. Hire a motorhome in the UK or Europe and let the adventure begin, for a few days or several weeks. The choice is yours.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {destinations.map((dest, index) => (
              <div key={index} className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-2 hover:border-main border border-transparent">
                <h4 className="font-semibold text-black mb-1">{dest.name}</h4>
                <p className="text-sm text-black/70">{dest.location}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {cities.map((city, index) => (
              <span key={index} className="bg-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer text-black hover:bg-secondary border border-gray-100">
                {city}
              </span>
            ))}
          </div>
          <div className="text-center">
            <a href="#rent" className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark transition-colors font-medium text-lg">
              Rent an RV
              <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center">Meet the community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <h4 className="font-semibold text-black text-lg">Andrei</h4>
              <p className="text-black/70">February 2025</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <h4 className="font-semibold text-black text-lg">Vyacheslav</h4>
              <p className="text-black/70">August 2024</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <h4 className="font-semibold text-black text-lg">Tanya</h4>
              <p className="text-black/70">July 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Process */}
      <section className="py-16 bg-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">Are you an owner? Rent out your campervan in complete security</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                01
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Create your listing</h3>
              <p className="text-black/70">Availability, pricing, options... You stay in control!</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                02
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Receive requests</h3>
              <p className="text-black/70">Consult your dashboard and manage all your requests.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                03
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Departure is imminent</h3>
              <p className="text-black/70">Hand the keys to your renters and make your vehicle profitable.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <a href="#create-listing" className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark transition-colors font-medium text-lg mr-4">
              Create your listing
            </a>
            <a href="#owner-info" className="inline-block text-main hover:text-main-dark font-medium text-lg">
              Find out more
            </a>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">RV rental in Europe</h2>
          <p className="text-center text-black/70 mb-8 max-w-3xl mx-auto text-lg">
            Your next road trip awaits. In a neighbouring country or on your doorstep, rent a motorhome in Europe without constraint. Behind the wheel of your vehicle you are free to travel wherever you want. At the beach with sand between your toes or the mountains with your head in the clouds, simply do what you please.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {countries.map((country, index) => (
              <span key={index} className="bg-bgLight px-5 py-2.5 rounded-md hover:bg-secondary transition-colors cursor-pointer text-black border border-gray-200">
                {country}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-main text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to the newsletter</h2>
          <p className="text-white/90 mb-8 text-lg">
            Join the community and receive exclusive offers, destination ideas, tips for owners and much more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-4 py-3 rounded-md text-black focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark transition-colors font-medium text-lg">
              Sign up
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-main-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">CaravaGo</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                CaravaGo connects holidaymakers with local campervan and motorhome owners across Europe through its secure platform. Hire the motorhome of your dreams, at home or abroad, with comprehensive insurance and support included. Connect, share and escape with CaravaGo!
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">MOTORHOME RENTAL</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#how-it-works" className="hover:text-secondary transition-colors text-white/80">How it works?</a></li>
                <li><a href="#rent-rv" className="hover:text-secondary transition-colors text-white/80">Rent an RV</a></li>
                <li><a href="#first-steps" className="hover:text-secondary transition-colors text-white/80">Your first steps driving a motorhome</a></li>
                <li><a href="#reviews" className="hover:text-secondary transition-colors text-white/80">Our customers' reviews</a></li>
                <li><a href="#help-renters" className="hover:text-secondary transition-colors text-white/80">Help for renters</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">OWNERS</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#create-listing" className="hover:text-secondary transition-colors text-white/80">Create a listing</a></li>
                <li><a href="#contract" className="hover:text-secondary transition-colors text-white/80">Rental contract</a></li>
                <li><a href="#insurance" className="hover:text-secondary transition-colors text-white/80">Rental insurance</a></li>
                <li><a href="#breakdown" className="hover:text-secondary transition-colors text-white/80">Breakdown assistance</a></li>
                <li><a href="#help-owners" className="hover:text-secondary transition-colors text-white/80">Help for motorhome owners</a></li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-white/80 mb-4">3.54/5 on 306 customer reviews on Trusted Shops</p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/80">
            <p>&copy; 2024 CaravaGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;