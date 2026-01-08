import { useState } from 'react';
import { Navigate } from 'react-router-dom';
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
import {
  useUserBookings,
  useUserListings,
  useUserReviews,
  useUserFavorites,
  useUserMessages,
  useUserNotifications
} from '../hooks/useUserData';
import authBackground from '../public/auth-background.jpg';

const Profile = () => {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  // Fetch real data from API with real-time updates
  const { bookings: userBookings, loading: bookingsLoading } = useUserBookings(true);
  const { listings: userListings, loading: listingsLoading } = useUserListings(true);
  const { reviews: userReviews, loading: reviewsLoading } = useUserReviews(true);
  const { favorites: userFavorites, loading: favoritesLoading } = useUserFavorites(true);
  const { messages: userMessages, loading: messagesLoading } = useUserMessages(true);
  const { notifications: userNotifications, loading: notificationsLoading, markAsRead } = useUserNotifications(true);

  // Wait for AuthContext to finish loading before checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  // Check if user exists, if not redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <OverviewSection
            userBookings={userBookings}
            userListings={userListings}
            user={user}
            bookingsLoading={bookingsLoading}
            listingsLoading={listingsLoading}
          />
        );
      case 'profile':
        return <ProfileInfoSection />;
      case 'verification':
        return <VerificationSection />;
      case 'reservations':
        return (
          <ReservationsSection
            userBookings={userBookings}
            loading={bookingsLoading}
          />
        );
      case 'listings':
        return (
          <ListingsSection
            userListings={userListings}
            loading={listingsLoading}
          />
        );
      case 'reviews':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 font-lexend">My Reviews</h2>
            {reviewsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              </div>
            ) : userReviews.length > 0 ? (
              <div className="space-y-4">
                {userReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet.</p>
            )}
          </div>
        );
      case 'favorites':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 font-lexend">My Favorites</h2>
            {favoritesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              </div>
            ) : userFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userFavorites.map(favorite => (
                  <div key={favorite.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{favorite.title}</h3>
                    <p className="text-gray-600">{favorite.location}</p>
                    <p className="text-pink-600 font-bold">€{favorite.daily_rate}/day</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No favorites yet.</p>
            )}
          </div>
        );
      case 'messages':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 font-lexend">Messages</h2>
            {messagesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              </div>
            ) : userMessages.length > 0 ? (
              <div className="space-y-4">
                {userMessages.map(message => (
                  <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{message.sender_name || 'Unknown'}</p>
                        <p className="text-gray-700">{message.message}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No messages yet.</p>
            )}
          </div>
        );
      case 'notifications':
        return (
          <NotificationsSection
            notifications={userNotifications}
            loading={notificationsLoading}
            onMarkAsRead={markAsRead}
          />
        );
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
        return (
          <OverviewSection
            userBookings={userBookings}
            userListings={userListings}
            user={user}
            bookingsLoading={bookingsLoading}
            listingsLoading={listingsLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authBackground})` }}
      >
        {/* Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-primary/20 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <main className="relative pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1.5 w-12 bg-gradient-to-r from-main via-primary to-secondary rounded-full"></div>
              <span className="text-sm font-semibold text-main uppercase tracking-wider">Your Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-lexend mb-2">
              Marhaba, {user?.name?.split(' ')[0] || 'Traveler'}! 👋
            </h1>
            <p className="text-gray-600 text-lg">Manage your CaravaGo journey across Morocco</p>
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