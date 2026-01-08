import React from 'react';
import VehicleCard from './VehicleCard';

const VehicleList = ({ vehicles }) => {
    if (!vehicles || vehicles.length === 0) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 text-lg">No vehicles found matching your criteria.</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your filters.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Rent a motorhome</h2>
                <p className="text-gray-600 text-sm">
                    {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} available
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="h-[420px]">
                        <VehicleCard vehicle={vehicle} />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-10 gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-main text-white font-semibold shadow-sm hover:bg-primary-dark transition-colors">
                    1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 font-medium transition-colors">
                    2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 font-medium transition-colors">
                    3
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 font-medium transition-colors">
                    4
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 font-medium transition-colors">
                    {'>'}
                </button>
            </div>
        </div>
    );
};

export default VehicleList;
