import React from 'react';
import { FaStar, FaUserFriends, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
    // Destructure vehicle data with defaults
    const {
        id,
        type = 'Campervan',
        location = 'Unknown Location',
        capacity = 2,
        pricePerDay = 100,
        totalPrice = 500,
        rating = 5.0,
        image = 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badge = 'Book on CaravaGo'
    } = vehicle || {};

    return (
        <Link to={`/vehicle/${id || 'mock-id'}`} className="block h-full">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full group cursor-pointer transform hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden bg-gray-100">
                    <img
                        src={image}
                        alt={type}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-main shadow-md flex items-center gap-1.5">
                        <img src="/logo-icon.png" className="w-4 h-4 hidden" alt="" />
                        {badge}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    {/* Type & Location */}
                    <div className="mb-3">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{type}</h3>
                        <p className="text-gray-600 text-sm flex items-center gap-1.5">
                            <FaMapMarkerAlt className="text-gray-400 text-xs" />
                            {location}
                        </p>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-5">
                        <FaUserFriends className="text-gray-400" />
                        <span className="font-medium">{capacity} travelers</span>
                    </div>

                    {/* Footer: Rating & Price */}
                    <div className="mt-auto flex justify-between items-end border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-1.5">
                            <FaStar className="text-yellow-400 fill-current" />
                            <span className="font-bold text-gray-900">{rating}</span>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-gray-900 text-xl">
                                €{pricePerDay}
                                <span className="text-sm font-medium text-gray-500">/day</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">€{totalPrice} total</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VehicleCard;
