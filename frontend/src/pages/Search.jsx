import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchNavbar from '../components/search/SearchNavbar';
import SearchFilters from '../components/search/SearchFilters';
import VehicleList from '../components/search/VehicleList';
import Map from '../components/search/Map';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Mock data for demonstration
const mockVehicles = [
    {
        id: 1,
        type: 'Campervan',
        location: 'Shoreham-by-Sea',
        capacity: 4,
        pricePerDay: 102,
        totalPrice: 1951,
        rating: 5.0,
        coordinates: [50.8350, -0.2730],
        image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badge: 'Book on Goboony'
    },
    {
        id: 2,
        type: 'Campervan',
        location: 'Brighton',
        capacity: 4,
        pricePerDay: 103,
        totalPrice: 1966,
        rating: 5.0,
        coordinates: [50.8225, -0.1372],
        image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badge: 'Book on Goboony'
    },
    {
        id: 3,
        type: 'Campervan',
        location: 'Hove',
        capacity: 4,
        pricePerDay: 60,
        totalPrice: 1349,
        rating: 5.0,
        coordinates: [50.8279, -0.1716],
        image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badge: 'Book on Goboony'
    },
    {
        id: 4,
        type: 'Low profile motorhome',
        location: 'Storrington',
        capacity: 4,
        pricePerDay: 89,
        totalPrice: 1702,
        rating: 5.0,
        coordinates: [50.9167, -0.4500],
        image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badge: 'Book on Goboony'
    },
    {
        id: 5,
        type: 'Campervan',
        location: 'Horsey',
        capacity: 4,
        pricePerDay: 97,
        totalPrice: 1843,
        rating: 5.0,
        coordinates: [50.8400, -0.0800],
        image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badge: 'Book on Goboony'
    },
    {
        id: 6,
        type: 'Large campervan',
        location: 'East Sussex',
        capacity: 3,
        pricePerDay: 82,
        totalPrice: 1568,
        rating: 5.0,
        coordinates: [50.9000, -0.2000],
        image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badge: 'Book on Goboony'
    },
    {
        id: 7,
        type: 'Campervan',
        location: 'Shoreham-by-sea',
        capacity: 4,
        pricePerDay: 113,
        totalPrice: 2184,
        rating: 4.8,
        coordinates: [50.8320, -0.2700],
        image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badge: 'Book on Goboony'
    },
    {
        id: 8,
        type: 'Low profile motorhome',
        location: 'West Sussex',
        capacity: 4,
        pricePerDay: 154,
        totalPrice: 2930,
        rating: 5.0,
        coordinates: [50.9500, -0.3500],
        image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badge: 'Book on Goboony'
    },
];

const Search = () => {
    const [searchParams] = useSearchParams();
    const [showMap, setShowMap] = useState(true);
    const [priceRange, setPriceRange] = useState({ min: null, max: 500 });

    // Get search parameters
    const destination = searchParams.get('destination') || 'Marrakech, Morocco';
    const startDate = searchParams.get('startDate') || 'Feb 1, 2026';
    const endDate = searchParams.get('endDate') || 'Feb 19, 2026';

    // Parse vehicleTypes from URL
    const vehicleTypesParam = searchParams.get('vehicleTypes');
    const initialVehicleTypes = vehicleTypesParam ? [vehicleTypesParam] : null;

    const [filters, setFilters] = useState({
        travellers: null,
        vehicleTypes: initialVehicleTypes,
        equipment: null,
        preferences: null,
        discounts: null,
        animalsAllowed: false
    });

    // Filter vehicles based on all filters
    const filteredVehicles = mockVehicles.filter(vehicle => {
        // Price filter
        if (priceRange.max !== null && vehicle.pricePerDay > priceRange.max) return false;
        if (priceRange.min !== null && vehicle.pricePerDay < priceRange.min) return false;

        // Travellers filter
        if (filters.travellers !== null && vehicle.capacity < filters.travellers) return false;

        // Vehicle type filter
        if (filters.vehicleTypes && filters.vehicleTypes.length > 0) {
            const typeMap = {
                'camper': 'Campervan',
                'van': 'Campervan',
                'low-profile': 'Low profile motorhome',
                'coachbuilt': 'Coachbuilt',
                'a-class': 'A class',
                'caravan': 'Caravan'
            };
            const vehicleTypeMatch = filters.vehicleTypes.some(vt => {
                const mappedType = typeMap[vt];
                return mappedType && vehicle.type.includes(mappedType);
            });
            if (!vehicleTypeMatch) return false;
        }

        // Animals allowed
        if (filters.animalsAllowed) {
            // This would need to be in the vehicle data
            // For now, we'll just pass through
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Navbar */}
            <SearchNavbar 
                destination={destination}
                startDate={startDate}
                endDate={endDate}
            />

            {/* Search Filters */}
            <SearchFilters 
                showMap={showMap} 
                setShowMap={setShowMap}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                destination={destination}
                startDate={startDate}
                endDate={endDate}
                filters={filters}
                setFilters={setFilters}
            />

            {/* Main Content: Split Layout */}
            <div className="flex h-[calc(100vh-80px)]">
                {/* Left: Vehicle List */}
                <div className={`${showMap ? 'w-1/2' : 'w-full'} overflow-y-auto transition-all duration-300 bg-gray-50`}>
                    <VehicleList vehicles={filteredVehicles} />
                </div>

                {/* Right: Map */}
                {showMap && (
                    <div className="w-1/2 sticky top-0 h-full hidden md:block border-l border-gray-200">
                        <ErrorBoundary fallbackMessage="The map failed to load. Please try refreshing the page.">
                            <Map vehicles={filteredVehicles} />
                        </ErrorBoundary>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
