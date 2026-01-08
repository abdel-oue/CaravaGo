import { motion } from 'framer-motion';

const NotificationsSection = ({ notifications, loading, onMarkAsRead }) => {
  const handleMarkAsRead = async (notificationId) => {
    if (onMarkAsRead) {
      await onMarkAsRead(notificationId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-lg font-bold text-gray-900 mb-4 font-lexend">Notifications</h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <span className="ml-2 text-gray-600">Loading notifications...</span>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-colors ${
                notification.is_read
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm ${
                    notification.is_read ? 'text-gray-900' : 'text-blue-900'
                  }`}>
                    {notification.title}
                  </h4>
                  <p className={`text-xs mt-1 ${
                    notification.is_read ? 'text-gray-600' : 'text-blue-700'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.created_at).toLocaleDateString()} at{' '}
                    {new Date(notification.created_at).toLocaleTimeString()}
                  </p>
                </div>
                {!notification.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5V7h-2v5l5 5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
            </svg>
          </div>
          <p className="text-gray-600">No notifications yet.</p>
        </div>
      )}

      {/* Notification Settings - keep this below */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-md font-bold text-gray-900 mb-4 font-lexend">Notification Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm">Booking Confirmations</h4>
              <p className="text-gray-600 text-xs">When someone books your RV</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm">Reservation Updates</h4>
              <p className="text-gray-600 text-xs">Updates about your bookings</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm">Marketing Emails</h4>
              <p className="text-gray-600 text-xs">Tips, promotions, and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm">Account Activity</h4>
              <p className="text-gray-600 text-xs">Security alerts and changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
            Save Preferences
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationsSection;
