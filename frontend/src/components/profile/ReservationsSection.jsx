import { motion } from 'framer-motion';
import { useState } from 'react';
import DetailModal from './DetailModal';

const ReservationsSection = ({ mockReservations }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
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
        <h2 className="text-lg font-bold text-gray-900 font-lexend">My Reservations</h2>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
          Browse Vehicles
        </button>
      </div>

      {mockReservations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">No reservations yet</h3>
          <p className="text-gray-600 text-sm mb-4">Start exploring amazing RV adventures!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{reservation.vehicle}</h3>
                  <p className="text-gray-600 text-xs flex items-center mb-1">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {reservation.location}
                  </p>
                  <p className="text-gray-600 text-xs flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h6a2 2 0 012 2v4m-6 4v10m0 0l-2-2m2 2l2-2m6-6h2a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 7H7a2 2 0 00-2 2v2a2 2 0 002 2h2"></path>
                    </svg>
                    {reservation.dates}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  reservation.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {reservation.status}
                </span>
              </div>

                <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">€{reservation.price}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(reservation)}
                    className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-lg font-semibold transition-colors text-xs"
                  >
                    View Details
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg font-semibold transition-colors text-xs">
                    Contact
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
        type="booking"
        data={selectedBooking}
      />
    </motion.div>
  );
};

export default ReservationsSection;
