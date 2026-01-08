import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchNavbar from '../components/search/SearchNavbar';
import SearchFilters from '../components/search/SearchFilters';
import VehicleList from '../components/search/VehicleList';
import Map from '../components/search/Map';
import ErrorBoundary from '../components/common/ErrorBoundary';
import vanImage from '../public/vanmain1.jpg';
import vanImage2 from '../public/vanmain2.jpg';
import vanImage3 from '../public/vanmain3.jpg';
import vanImage4 from '../public/vanmain4.jpg';
import vanImage5 from '../public/vanmain5.jpg';
import vanImage6 from '../public/vanmain6.jpg';
import vanImage7 from '../public/vanmain7.jpg';
import vanImage8 from '../public/vanmain8.jpg';


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
        image: vanImage,
        badge: 'Book on CaravaGo'
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
        image: vanImage2,
        badge: 'Book on CaravaGo'
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
        image: vanImage3,
        badge: 'Book on CaravaGo'
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
        image: vanImage4,
        badge: 'Book on CaravaGo'
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
        image: vanImage5,
        badge: 'Book on CaravaGo'
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
        image: vanImage6,
        badge: 'Book on CaravaGo'
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
        image: vanImage7,
        badge: 'Book on CaravaGo'
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
        image: vanImage8,
        badge: 'Book on CaravaGo'
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
