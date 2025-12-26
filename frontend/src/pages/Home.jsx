import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                CaravaGo
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#download" className="text-gray-700 hover:text-indigo-600 transition-colors">Download the app</a>
              <a href="#create-listing" className="text-gray-700 hover:text-indigo-600 transition-colors">Create a listing</a>
              <a href="#help" className="text-gray-700 hover:text-indigo-600 transition-colors">Help</a>
              {user ? (
                <>
                  <span className="text-gray-700">Welcome, {user.name}</span>
                  <button
                    onClick={logout}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="text-gray-700 hover:text-indigo-600 transition-colors">Sign in</Link>
                  <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Choose your route, Travel your way
            </h1>
            <p className="text-xl mb-8 text-indigo-100">RV rental marketplace</p>
            
            {/* Search Form */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 mt-8 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Where? Pick-up location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your travel dates</label>
                  <input
                    type="text"
                    placeholder="Departure/Return"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium">
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-2 text-indigo-100">
              <span>WITH LOVE EST. 2024 FROM CARAVAGO</span>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold">4.9</span>
                <span className="text-lg">/5</span>
              </div>
              <span className="text-indigo-200">with</span>
              <span className="font-semibold">369,245 reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">The largest selection of vehicles in Europe</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Departing trips from Europe or elsewhere</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Insurance and breakdown assistance included</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Great deals all year round</h3>
            </div>
          </div>
          <p className="text-center mt-8 text-gray-600 text-lg">
            The motorhome is the best way to travel without breaking the bank!
          </p>
          <div className="text-center mt-4">
            <a href="#deals" className="text-indigo-600 hover:text-indigo-700 font-medium">
              All the best deals →
            </a>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your reviews on CaravaGo, a never-ending story
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-4xl">★★★★★</span>
              <span className="text-2xl font-bold">4.9/5</span>
            </div>
            <p className="text-gray-600">
              That's how our users rate CaravaGo! Rated 4.9 with 369,245 reviews
            </p>
          </div>
        </div>
      </section>

      {/* Owner CTA */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Are you an owner?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Hire and make the most of your vehicle with complete confidence
          </p>
          <a href="#owner" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium">
            Find out more →
          </a>
        </div>
      </section>

      {/* Vehicle Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Choose the right vehicle</h2>
          <p className="text-center text-gray-600 mb-12">
            Looking for a motorhome or a campervan? Asking yourself the right questions before hiring a motorhome, campervan or large campervan is the key to a stress-free road trip. There is a perfect vehicle for any travel plan. Don't worry, we'll introduce you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicleTypes.map((vehicle, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{vehicle.name}</h3>
                <p className="text-indigo-600 font-medium mb-3">{vehicle.description}</p>
                <p className="text-gray-600 text-sm mb-4">{vehicle.detail}</p>
                <a href={vehicle.link} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                  Rent a {vehicle.name.toLowerCase()} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Our destinations</h2>
          <p className="text-center text-gray-600 mb-12">
            In a motorhome? Anything is possible. Nothing is easier than hitting the road. Hire a motorhome in the UK or Europe and let the adventure begin, for a few days or several weeks. The choice is yours.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {destinations.map((dest, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <h4 className="font-semibold text-gray-900">{dest.name}</h4>
                <p className="text-sm text-gray-600">{dest.location}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {cities.map((city, index) => (
              <span key={index} className="bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer text-gray-700">
                {city}
              </span>
            ))}
          </div>
          <div className="text-center">
            <a href="#rent" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium">
              Rent an RV →
            </a>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Meet the community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h4 className="font-semibold text-gray-900">Andrei</h4>
              <p className="text-gray-600">February 2025</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h4 className="font-semibold text-gray-900">Vyacheslav</h4>
              <p className="text-gray-600">August 2024</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h4 className="font-semibold text-gray-900">Tanya</h4>
              <p className="text-gray-600">July 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Process */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Are you an owner? Rent out your campervan in complete security</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                01
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create your listing</h3>
              <p className="text-gray-600">Availability, pricing, options... You stay in control!</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                02
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Receive requests</h3>
              <p className="text-gray-600">Consult your dashboard and manage all your requests.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                03
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Departure is imminent</h3>
              <p className="text-gray-600">Hand the keys to your renters and make your vehicle profitable.</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <a href="#create-listing" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium mr-4">
              Create your listing
            </a>
            <a href="#owner-info" className="inline-block text-indigo-600 hover:text-indigo-700 font-medium">
              Find out more
            </a>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">RV rental in Europe</h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Your next road trip awaits. In a neighbouring country or on your doorstep, rent a motorhome in Europe without constraint. Behind the wheel of your vehicle you are free to travel wherever you want. At the beach with sand between your toes or the mountains with your head in the clouds, simply do what you please.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {countries.map((country, index) => (
              <span key={index} className="bg-gray-100 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer text-gray-700">
                {country}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to the newsletter</h2>
          <p className="text-indigo-100 mb-6">
            Join the community and receive exclusive offers, destination ideas, tips for owners and much more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-4 py-2 rounded-md text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-indigo-600 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium">
              Sign up
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">CaravaGo</h3>
              <p className="text-sm">
                CaravaGo connects holidaymakers with local campervan and motorhome owners across Europe through its secure platform. Hire the motorhome of your dreams, at home or abroad, with comprehensive insurance and support included. Connect, share and escape with CaravaGo!
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">MOTORHOME RENTAL</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#how-it-works" className="hover:text-white">How it works?</a></li>
                <li><a href="#rent-rv" className="hover:text-white">Rent an RV</a></li>
                <li><a href="#first-steps" className="hover:text-white">Your first steps driving a motorhome</a></li>
                <li><a href="#reviews" className="hover:text-white">Our customers' reviews</a></li>
                <li><a href="#help-renters" className="hover:text-white">Help for renters</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">OWNERS</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#create-listing" className="hover:text-white">Create a listing</a></li>
                <li><a href="#contract" className="hover:text-white">Rental contract</a></li>
                <li><a href="#insurance" className="hover:text-white">Rental insurance</a></li>
                <li><a href="#breakdown" className="hover:text-white">Breakdown assistance</a></li>
                <li><a href="#help-owners" className="hover:text-white">Help for motorhome owners</a></li>
              </ul>
            </div>
            <div>
              <p className="text-sm mb-4">3.54/5 on 306 customer reviews on Trusted Shops</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 CaravaGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

