import { motion } from 'framer-motion';
import { useState } from 'react';
import DetailModal from './DetailModal';

const ListingsSection = ({ mockListings }) => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 font-lexend">My Listings</h2>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
          Add New Listing
        </button>
      </div>

      {mockListings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600 text-sm mb-4">Share your RV with travelers and start earning!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{listing.title}</h3>
                  <p className="text-gray-600 text-xs flex items-center mb-1">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {listing.location}
                  </p>
                  <p className="text-gray-600 text-xs flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    €{listing.price}/day
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  listing.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {listing.status}
                </span>
              </div>

                <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{listing.bookings} bookings</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(listing)}
                    className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-lg font-semibold transition-colors text-xs"
                  >
                    View Details
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg font-semibold transition-colors text-xs">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="listing"
        data={selectedListing}
      />
    </motion.div>
  );
};

export default ListingsSection;
