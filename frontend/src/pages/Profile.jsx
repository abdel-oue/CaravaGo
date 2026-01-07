import { useState } from 'react';
import {
  ProfileSidebar,
  OverviewSection,
  ProfileInfoSection,
  VerificationSection,
  ReservationsSection,
  ListingsSection,
  SecuritySection,
  NotificationsSection
} from '../components/profile';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  // Mock data for reservations
  const mockReservations = [
    {
      id: 1,
      vehicle: 'VW California Ocean',
      location: 'Barcelona, Spain',
      dates: '2025-01-15 to 2025-01-20',
      status: 'confirmed',
      price: 250,
      image: '/assets/test1.jpg'
    },
    {
      id: 2,
      vehicle: 'Mercedes Sprinter Camper',
      location: 'Amsterdam, Netherlands',
      dates: '2025-02-10 to 2025-02-15',
      status: 'pending',
      price: 400,
      image: '/assets/heroimagetest2.jpg'
    }
  ];

  // Mock data for listings
  const mockListings = [
    {
      id: 1,
      title: 'Cozy VW California Beach Cruiser',
      location: 'Lisbon, Portugal',
      price: 45,
      status: 'active',
      bookings: 12,
      image: '/assets/test1.jpg'
    },
    {
      id: 2,
      title: 'Luxury Mercedes Sprinter Adventure',
      location: 'Berlin, Germany',
      price: 65,
      status: 'active',
      bookings: 8,
      image: '/assets/heroimagetest2.jpg'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection mockReservations={mockReservations} mockListings={mockListings} user={user} />;
      case 'profile':
        return <ProfileInfoSection />;
      case 'verification':
        return <VerificationSection />;
      case 'reservations':
        return <ReservationsSection mockReservations={mockReservations} />;
      case 'listings':
        return <ListingsSection mockListings={mockListings} />;
      case 'reviews':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 font-lexend">My Reviews</h2>
            <p className="text-gray-600">Reviews section coming soon...</p>
          </div>
        );
      case 'favorites':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 font-lexend">My Favorites</h2>
            <p className="text-gray-600">Favorites section coming soon...</p>
          </div>
        );
      case 'messages':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 font-lexend">Messages</h2>
            <p className="text-gray-600">Messages section coming soon...</p>
          </div>
        );
      case 'notifications':
        return <NotificationsSection />;
      case 'security':
        return <SecuritySection />;
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 font-lexend">Account Settings</h2>
            <p className="text-gray-600">Settings section coming soon...</p>
          </div>
        );
      default:
        return <OverviewSection mockReservations={mockReservations} mockListings={mockListings} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-primary/5">
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-lexend">
              Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!
            </h1>
            <p className="text-gray-600 mt-2">Manage your account and explore</p>
          </div>

          {/* Main Content Layout */}
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="flex-shrink-0">
              <ProfileSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;