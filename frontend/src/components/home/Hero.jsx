import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useLocationAutocomplete } from '../../hooks/useLocations';
import heroImage from '../../public/heroimgtesst.jpg';

const Hero = () => {
    const navigate = useNavigate();
    const {
        query,
        setQuery,
        suggestions,
        loading: locationLoading,
        selectedLocation,
        selectLocation,
        clearSelection,
        showDropdown,
        handleInputFocus,
        handleInputBlur
    } = useLocationAutocomplete();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleSearch = () => {
        // Navigate to search page with query parameters
        const params = new URLSearchParams();
        if (selectedLocation) {
            params.set('destination', `${selectedLocation.city}, ${selectedLocation.country}`);
            params.set('lat', selectedLocation.latitude);
            params.set('lng', selectedLocation.longitude);
        } else if (query) {
            params.set('destination', query);
        }
        if (startDate) params.set('startDate', startDate.toLocaleDateString());
        if (endDate) params.set('endDate', endDate.toLocaleDateString());
        navigate(`/search?${params.toString()}`);
    };

    return (
        <section className="relative w-full overflow-hidden mb-20">
            <div className="flex flex-col lg:flex-row min-h-[600px] lg:h-[600px]">
                {/* Left Side: Solid Teal */}
                <div className="w-full lg:w-1/2 bg-main text-white relative flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-16 lg:py-0">
                    {/* Stamp Graphic Placeholder */}
                    <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
                        <div className="w-32 h-32 border-2 border-white rounded-full flex items-center justify-center rotate-12">
                            <span className="text-xs uppercase text-center font-bold tracking-widest">With Love<br />From<br />CaravaGo</span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4 font-lexend">
                            Discover Morocco,<br />
                            Your way
                        </h1>
                        <p className="text-xl text-white/90 font-light">
                            Morocco's premier campervan & motorhome rental platform
                        </p>
                    </motion.div>
                </div>

                {/* Right Side: Hero Image */}
                <div className="w-full lg:w-1/2 relative h-[400px] lg:h-auto">
                    <img
                        src={heroImage}
                        alt="Campervan life"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Floating Search Bar */}
            <div className="absolute top-[85%] lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-[150px] w-full px-4sm:px-6 lg:px-0 z-30 pointer-events-none">
                <motion.div
                    className="bg-white rounded-lg shadow-xl max-w-5xl mx-auto pointer-events-auto flex flex-col md:flex-row border border-gray-100"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 p-4 relative">
                        <label className="block text-sm font-bold text-gray-800 mb-1">Where?</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Choose Moroccan city"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                className="w-full outline-none text-gray-600 placeholder-gray-400"
                            />
                            {locationLoading && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                                </div>
                            )}
                        </div>

                        {/* Autocomplete Dropdown */}
                        {showDropdown && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-[160] max-h-60 overflow-y-auto mt-1">
                                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        {query ? 'Search Results' : 'Popular Locations'}
                                    </div>
                                </div>
                                {suggestions.map((location) => (
                                    <div
                                        key={`${location.city}-${location.country}`}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        onClick={() => selectLocation(location)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <FaMapMarkerAlt className="text-gray-400 text-sm" />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {location.city}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {location.region && `${location.region}, `}{location.country}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Date Input */}
                    <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 p-4">
                        <label className="block text-sm font-bold text-gray-800 mb-1">Your travel dates</label>
                        <div className="flex gap-2">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Departure/Return"
                                className="w-full outline-none text-gray-600 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="p-2 md:p-3">
                        <button
                            onClick={handleSearch}
                            className="w-full md:w-auto h-full bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 md:py-0 rounded-md transition-colors text-lg"
                        >
                            Search
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Trust Bar */}
            <div className="bg-[#f0f9ff] py-8 border-b border-gray-100 hidden lg:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center text-sm text-[#005C7B]">
                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <span className="text-4xl text-[#007A9F]">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                            </span>
                            <div className="flex flex-col">
                                <div className="flex text-secondary text-lg">★★★★★</div>
                                <p>Rated <span className="font-bold">4.9/5</span> with <span className="font-bold">369,976</span> reviews</p>
                            </div>
                        </div>

                        {/* Selection */}
                        <div className="flex items-center gap-3">
                            <span className="text-4xl text-[#007A9F]">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                {/* Using a generic swap/vehicle icon placeholder as SVG */}
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            </span>
                            <p className="max-w-[150px]">Morocco's largest campervan selection</p>
                        </div>

                        {/* Global */}
                        <div className="flex items-center gap-3">
                            <span className="text-4xl text-[#007A9F]">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </span>
                            <p className="max-w-[150px]">Explore Morocco from any city</p>
                        </div>

                        {/* Insurance */}
                        <div className="flex items-center gap-3">
                            <span className="text-4xl text-[#007A9F]">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </span>
                            <p className="max-w-[160px]">Insurance and breakdown assistance included</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Spacer (retained only for mobile view) */}
            <div className="h-32 lg:hidden bg-white"></div>
        </section>
    );
};

export default Hero;
