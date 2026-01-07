import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const DetailModal = ({ isOpen, onClose, type, data }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!data) return null;

  const renderBookingDetails = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-lexend">{data.vehicle}</h2>
          <p className="text-gray-600 mt-1">Booking #{data.id}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          data.status === 'confirmed'
            ? 'bg-green-100 text-green-800'
            : data.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {data.status}
        </div>
      </div>

      {/* Key Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Trip Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">{data.dates.split(' to ')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">{data.dates.split(' to ')[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">3 nights</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{data.location}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Payment</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Price:</span>
                <span className="font-bold text-lg text-primary">€{data.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="text-green-600 font-medium">Paid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">Credit Card ****1234</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Vehicle Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Make/Model:</span>
                <span className="font-medium">VW California Ocean 2022</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sleeps:</span>
                <span className="font-medium">2 people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Length:</span>
                <span className="font-medium">4.9m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel:</span>
                <span className="font-medium">Diesel</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Owner Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">Maria Rodriguez</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium">⭐ 4.8 (127 reviews)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Response Time:</span>
                <span className="font-medium text-green-600">Usually within 1 hour</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Included Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Kitchen', 'Bathroom', 'Air Conditioning', 'WiFi', 'Fridge', 'Awning', 'Solar Panels', 'Generator'].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <button className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-xl font-semibold transition-colors">
          Message Owner
        </button>
        <button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-colors border border-gray-300">
          View on Map
        </button>
        <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-xl font-semibold transition-colors border border-red-200">
          Cancel Booking
        </button>
      </div>
    </div>
  );

  const renderListingDetails = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-lexend">{data.title}</h2>
          <p className="text-gray-600 mt-1">Listing #{data.id}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          data.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {data.status}
        </div>
      </div>

      {/* Key Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Vehicle Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Make/Model:</span>
                <span className="font-medium">VW California Ocean 2022</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year:</span>
                <span className="font-medium">2022</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sleeps:</span>
                <span className="font-medium">2 people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Length:</span>
                <span className="font-medium">4.9 meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel Type:</span>
                <span className="font-medium">Diesel</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Pricing</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Rate:</span>
                <span className="font-bold text-lg text-primary">€{data.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min. Rental:</span>
                <span className="font-medium">2 nights</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max. Rental:</span>
                <span className="font-medium">90 nights</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Currency:</span>
                <span className="font-medium">EUR</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Location & Availability</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{data.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Coordinates:</span>
                <span className="font-medium">40.7128° N, 74.0060° W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bookings:</span>
                <span className="font-medium">{data.bookings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium">⭐ 4.6 (42 reviews)</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Booking Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">This Month:</span>
                <span className="font-medium text-green-600">8 bookings</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Year:</span>
                <span className="font-medium text-green-600">67 bookings</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue (YTD):</span>
                <span className="font-medium text-green-600">€12,430</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupancy Rate:</span>
                <span className="font-medium text-blue-600">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Kitchen', 'Bathroom', 'Air Conditioning', 'WiFi', 'Fridge', 'Microwave', 'Awning', 'Bike Rack'].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          Experience the freedom of the open road in this beautifully maintained VW California Ocean campervan.
          Perfect for couples or solo travelers looking to explore Europe's scenic routes. Fully equipped with
          everything you need for a comfortable camping adventure.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <button className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-xl font-semibold transition-colors">
          Edit Listing
        </button>
        <button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-colors border border-gray-300">
          View Public Page
        </button>
        <button className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-4 py-3 rounded-xl font-semibold transition-colors border border-yellow-200">
          Pause Listing
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {type === 'booking' ? 'Booking Details' : 'Listing Details'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-6">
              {type === 'booking' ? renderBookingDetails() : renderListingDetails()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
