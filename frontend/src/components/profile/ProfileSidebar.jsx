import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const ProfileSidebar = ({ activeSection, setActiveSection }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    Dashboard: true,
    Account: true,
    Activity: false,
    Communication: false,
    Preferences: false
  });

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const sidebarSections = [
    {
      category: 'Dashboard',
      color: 'from-primary to-primary-dark',
      items: [
        { id: 'overview', label: 'Overview', icon: 'dashboard', badge: null }
      ]
    },
    {
      category: 'Account',
      color: 'from-main to-main-light',
      items: [
        { id: 'profile', label: 'Personal Info', icon: 'user', badge: null },
        { id: 'verification', label: 'Verification', icon: 'shield', badge: null },
        { id: 'security', label: 'Security', icon: 'lock', badge: null }
      ]
    },
    {
      category: 'Activity',
      color: 'from-secondary to-yellow-500',
      items: [
        { id: 'reservations', label: 'My Bookings', icon: 'calendar', badge: '2' },
        { id: 'listings', label: 'My Listings', icon: 'car', badge: '2' },
        { id: 'reviews', label: 'Reviews', icon: 'star', badge: null },
        { id: 'favorites', label: 'Favorites', icon: 'heart', badge: null }
      ]
    },
    {
      category: 'Communication',
      color: 'from-purple-500 to-purple-600',
      items: [
        { id: 'messages', label: 'Messages', icon: 'message', badge: '3' },
        { id: 'notifications', label: 'Notifications', icon: 'bell', badge: '5' }
      ]
    },
    {
      category: 'Preferences',
      color: 'from-orange-500 to-orange-600',
      items: [
        { id: 'settings', label: 'Settings', icon: 'settings', badge: null }
      ]
    }
  ];

  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
      user: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      ),
      shield: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      calendar: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      ),
      car: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      ),
      lock: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      ),
      bell: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      ),
      star: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      ),
      heart: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      ),
      message: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      ),
      settings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  return (
    <div className="w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 sticky top-24 overflow-hidden">
      {/* Decorative top accent */}
      <div className="h-1.5 bg-gradient-to-r from-main via-primary to-secondary"></div>

      <div className="p-4">
        {sidebarSections.map((category, categoryIndex) => (
          <div key={category.category} className={categoryIndex > 0 ? 'mt-6' : 'mt-2'}>
            {/* Category Header - Clickable */}
            <button
              onClick={() => toggleCategory(category.category)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50/80 rounded-xl transition-all duration-200 group"
            >
              <div className="flex items-center space-x-2.5">
                <div className={`bg-gradient-to-r ${category.color} h-1.5 w-5 rounded-full shadow-sm`}></div>
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider group-hover:text-gray-800 transition-colors">
                  {category.category}
                </h3>
              </div>
              <motion.div
                animate={{ rotate: expandedCategories[category.category] ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400 group-hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </motion.div>
            </button>

            {/* Category Items - Expandable */}
            <AnimatePresence>
              {expandedCategories[category.category] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 px-1 mt-2">
                    {category.items.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all duration-300 group ${activeSection === item.id
                            ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-transparent text-primary shadow-sm border border-primary/20'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent hover:text-primary border border-transparent hover:border-gray-100'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`flex-shrink-0 transition-colors duration-300 ${activeSection === item.id ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
                            }`}>
                            {getIcon(item.icon)}
                          </div>
                          <span className="font-semibold text-sm">{item.label}</span>
                        </div>
                        {item.badge && (
                          <motion.span
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${activeSection === item.id
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-gray-200 text-gray-700 group-hover:bg-primary group-hover:text-white'
                              }`}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSidebar;
