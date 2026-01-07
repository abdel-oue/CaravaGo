import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaTags, FaUserFriends, FaCarSide, FaTools, FaSlidersH, FaMap, FaSearch, FaStar, FaGlobe, FaDog, FaRoad, FaBirthdayCake, FaBan, FaShower, FaHome, FaTv, FaSnowflake, FaBed, FaUser } from 'react-icons/fa';

const SearchFilters = ({
    showMap,
    setShowMap,
    priceRange,
    setPriceRange,
    destination,
    startDate,
    endDate,
    filters,
    setFilters
}) => {
    const [activeFilter, setActiveFilter] = useState(null);
    const dropdownRefs = useRef({});

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.entries(dropdownRefs.current).forEach(([filterId, ref]) => {
                if (ref && !ref.contains(event.target) && activeFilter === filterId) {
                    setActiveFilter(null);
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeFilter]);

    const handleFilterApply = (filterId) => {
        setActiveFilter(null);
    };

    const handleFilterClear = (filterId) => {
        if (filterId === 'price') {
            setPriceRange({ min: null, max: 500 });
        } else if (filterId === 'travellers' && setFilters) {
            setFilters({ ...filters, travellers: null, animalsAllowed: false });
        } else if (setFilters) {
            const filterMap = {
                'type': 'vehicleTypes',
                'equipment': 'equipment',
                'prefs': 'preferences'
            };
            const actualFilterId = filterMap[filterId] || filterId;
            setFilters({ ...filters, [actualFilterId]: null });
        }
        setActiveFilter(null);
    };

    const handlePriceChange = (value) => {
        setPriceRange({ ...priceRange, max: value });
    };

    const handleCheckboxChange = (filterId, value) => {
        if (!setFilters) return;
        const currentValues = filters[filterId] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        setFilters({ ...filters, [filterId]: newValues.length > 0 ? newValues : null });
    };

    const hasActiveFilter = (filterId) => {
        if (filterId === 'price') {
            return priceRange.max !== 500 || priceRange.min;
        }
        if (filterId === 'travellers') {
            return filters?.travellers || filters?.animalsAllowed;
        }
        if (filterId === 'type') {
            return filters?.vehicleTypes && filters.vehicleTypes.length > 0;
        }
        if (filterId === 'equipment') {
            return filters?.equipment && filters.equipment.length > 0;
        }
        if (filterId === 'prefs') {
            return filters?.preferences && filters.preferences.length > 0;
        }
        return false;
    };

    const getFilterBadge = (filterId) => {
        if (filterId === 'price' && priceRange.max !== 500) {
            return `€${priceRange.max}`;
        }
        if (filterId === 'travellers' && filters?.travellers) {
            return filters.travellers;
        }
        if (filterId === 'type' && filters?.vehicleTypes?.length) {
            return filters.vehicleTypes.length;
        }
        if (filterId === 'equipment' && filters?.equipment?.length) {
            return filters.equipment.length;
        }
        if (filterId === 'prefs' && filters?.preferences?.length) {
            return filters.preferences.length;
        }
        return null;
    };

    const FilterButton = ({ label, icon: Icon, id, children, badge }) => (
        <div className="relative" ref={el => dropdownRefs.current[id] = el}>
            <button
                onClick={() => setActiveFilter(activeFilter === id ? null : id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[4px] border text-sm font-medium transition-all
            ${activeFilter === id
                        ? 'border-main text-main bg-main/5 shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
            >
                {Icon && <Icon className={activeFilter === id ? 'text-main' : 'text-gray-400'} />}
                {label}
                {getFilterBadge(id) && (
                    <span className="ml-1 bg-main text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {getFilterBadge(id)}
                    </span>
                )}
                <FaChevronDown className={`text-xs transition-transform ${activeFilter === id ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {activeFilter === id && children && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-6 z-50 min-w-[380px] max-h-[600px] overflow-y-auto">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="sticky top-[72px] z-20 bg-white border-b border-gray-200 shadow-sm w-full">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-3">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

                    {/* Filters */}
                    <div className="flex items-center gap-3 overflow-x-auto lg:overflow-visible w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-[4px] bg-[#EEF7F9] text-[#006C85] font-bold text-sm whitespace-nowrap hover:bg-[#dcebf0] transition-colors border border-transparent">
                            <FaStar className="w-4 h-4" />
                            My ideal vehicle
                        </button>

                        <FilterButton
                            id="price"
                            label="Price per day"
                            icon={FaTags}
                        >
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-4">
                                        Maximum price per day
                                    </label>
                                    <div className="space-y-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="500"
                                            step="10"
                                            value={priceRange.max || 500}
                                            onChange={(e) => handlePriceChange(parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-main"
                                        />
                                        <div className="text-center">
                                            <span className="text-2xl font-bold text-gray-900">
                                                €{priceRange.max || 500}.00
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-sm font-semibold text-gray-700">Discounts</div>
                                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={filters?.discounts?.includes('early') || false}
                                            onChange={() => handleCheckboxChange('discounts', 'early')}
                                            className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                                        />
                                        <FaTags className="text-gray-400" />
                                        <span className="text-sm text-gray-700">Early bird discount</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={filters?.discounts?.includes('long') || false}
                                            onChange={() => handleCheckboxChange('discounts', 'long')}
                                            className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                                        />
                                        <FaTags className="text-gray-400" />
                                        <span className="text-sm text-gray-700">Longer hire discount</span>
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    {(priceRange.max || filters?.discounts?.length > 0) && (
                                        <button
                                            onClick={() => handleFilterClear('price')}
                                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleFilterApply('price')}
                                        className="flex-1 bg-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                                    >
                                        Validate
                                    </button>
                                </div>
                            </div>
                        </FilterButton>

                        <FilterButton
                            id="travellers"
                            label="Travellers"
                            icon={FaUserFriends}
                        >
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-4">Travellers</label>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Number of renters</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        const current = filters?.travellers || 0;
                                                        if (current > 0) setFilters({ ...filters, travellers: current - 1 });
                                                    }}
                                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                                >
                                                    <span className="text-gray-600">-</span>
                                                </button>
                                                <span className="w-12 text-center font-bold text-lg text-gray-900">
                                                    {filters?.travellers || 0}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        const current = filters?.travellers || 0;
                                                        setFilters({ ...filters, travellers: current + 1 });
                                                    }}
                                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                                >
                                                    <span className="text-gray-600">+</span>
                                                </button>
                                            </div>
                                        </div>
                                        <a href="#" className="text-sm text-main hover:underline font-medium">Show all criteria</a>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    <div className="text-sm font-semibold text-gray-700">Preferences</div>
                                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={filters?.animalsAllowed || false}
                                            onChange={() => setFilters({ ...filters, animalsAllowed: !filters?.animalsAllowed })}
                                            className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                                        />
                                        <FaDog className="text-gray-400" />
                                        <span className="text-sm text-gray-700">Animals allowed</span>
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    {(filters?.travellers || filters?.animalsAllowed) && (
                                        <button
                                            onClick={() => handleFilterClear('travellers')}
                                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleFilterApply('travellers')}
                                        className="flex-1 bg-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                                    >
                                        Validate
                                    </button>
                                </div>
                            </div>
                        </FilterButton>

                        <FilterButton
                            id="type"
                            label="Type of vehicle"
                            icon={FaCarSide}
                        >
                            <div className="space-y-4">
                                {[
                                    { id: 'camper', label: 'Camper', desc: 'It is not only photogenic. It is also practical and mobile', icon: FaCarSide },
                                    { id: 'van', label: 'Van', desc: 'The big brother of the campervan: autonomous and manoeuvrable', icon: FaCarSide },
                                    { id: 'low-profile', label: 'Low profile', desc: 'All the comfort of a house on wheels', icon: FaCarSide },
                                    { id: 'coachbuilt', label: 'Coachbuilt', desc: 'THE comfortable vehicle for large families', icon: FaCarSide },
                                    { id: 'a-class', label: "'A' class", desc: 'A true palace on wheels', icon: FaCarSide },
                                    { id: 'caravan', label: 'Caravan', desc: 'Put your house where you want', icon: FaCarSide }
                                ].map((vehicleType) => (
                                    <label
                                        key={vehicleType.id}
                                        className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer border-2 transition-all ${filters?.vehicleTypes?.includes(vehicleType.id)
                                            ? 'border-main bg-main/5'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters?.vehicleTypes?.includes(vehicleType.id) || false}
                                            onChange={() => handleCheckboxChange('vehicleTypes', vehicleType.id)}
                                            className="mt-1 w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <vehicleType.icon className="text-gray-400" />
                                                <span className="font-semibold text-gray-900">{vehicleType.label}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{vehicleType.desc}</p>
                                        </div>
                                    </label>
                                ))}
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    {filters?.vehicleTypes?.length > 0 && (
                                        <button
                                            onClick={() => handleFilterClear('type')}
                                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleFilterApply('type')}
                                        className="flex-1 bg-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                                    >
                                        Validate
                                    </button>
                                </div>
                            </div>
                        </FilterButton>

                        <FilterButton
                            id="equipment"
                            label="Equipment"
                            icon={FaTools}
                        >
                            <div className="space-y-6">
                                <div>
                                    <div className="text-sm font-bold text-gray-900 mb-4">Interior</div>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'baking', label: 'Baking sheets', icon: FaTools },
                                            { id: 'refrigerator', label: 'Refrigerator', icon: FaTools },
                                            { id: 'shower', label: 'Inside shower', icon: FaShower },
                                            { id: 'wc', label: 'WC', icon: FaHome },
                                            { id: 'ac', label: 'Air Conditioning', icon: FaSnowflake },
                                            { id: 'heater', label: 'Heater', icon: FaTools },
                                            { id: 'tv', label: 'TV', icon: FaTv },
                                            { id: 'dinnerware', label: 'Dinnerware Set', icon: FaTools },
                                            { id: 'bedding', label: 'Bedding', icon: FaBed }
                                        ].map((item) => (
                                            <label key={item.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={filters?.equipment?.includes(item.id) || false}
                                                    onChange={() => handleCheckboxChange('equipment', item.id)}
                                                    className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                                                />
                                                <item.icon className="text-gray-400" />
                                                <span className="text-sm text-gray-700">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 mb-4">Exterior</div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={filters?.equipment?.includes('side-blind') || false}
                                                onChange={() => handleCheckboxChange('equipment', 'side-blind')}
                                                className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                                            />
                                            <FaTools className="text-gray-400" />
                                            <span className="text-sm text-gray-700">Side Blind</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    {filters?.equipment?.length > 0 && (
                                        <button
                                            onClick={() => handleFilterClear('equipment')}
                                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleFilterApply('equipment')}
                                        className="flex-1 bg-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                                    >
                                        Validate
                                    </button>
                                </div>
                            </div>
                        </FilterButton>

                        <FilterButton
                            id="prefs"
                            label="Preferences"
                            icon={FaSlidersH}
                        >
                            <div className="space-y-6">
                                <div>
                                    <div className="text-sm font-bold text-gray-900 mb-4">Trip</div>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'unlimited-km', label: 'Unlimited kilometres', icon: FaRoad },
                                            { id: 'international', label: 'International travel', icon: FaGlobe },
                                            { id: 'animals', label: 'Animals allowed', icon: FaDog }
                                        ].map((item) => (
                                            <label key={item.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={filters?.preferences?.includes(item.id) || false}
                                                    onChange={() => handleCheckboxChange('preferences', item.id)}
                                                    className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                                                />
                                                <item.icon className="text-gray-400" />
                                                <span className="text-sm text-gray-700">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 mb-4">Vehicle</div>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'new', label: 'Less than 5 years old', icon: FaBirthdayCake },
                                            { id: 'non-smoker', label: 'Non-smoker', icon: FaBan }
                                        ].map((item) => (
                                            <label key={item.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={filters?.preferences?.includes(item.id) || false}
                                                    onChange={() => handleCheckboxChange('preferences', item.id)}
                                                    className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                                                />
                                                <item.icon className="text-gray-400" />
                                                <span className="text-sm text-gray-700">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 mb-4">Owners</div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={filters?.preferences?.includes('best-owners') || false}
                                                onChange={() => handleCheckboxChange('preferences', 'best-owners')}
                                                className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                                            />
                                            <FaStar className="text-gray-400" />
                                            <span className="text-sm text-gray-700">Best Owners only</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    {filters?.preferences?.length > 0 && (
                                        <button
                                            onClick={() => handleFilterClear('prefs')}
                                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleFilterApply('prefs')}
                                        className="flex-1 bg-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                                    >
                                        Validate
                                    </button>
                                </div>
                            </div>
                        </FilterButton>
                    </div>

                    {/* Right: Map Toggle */}
                    <div className="flex items-center gap-3 lg:ml-auto">
                        <span className="text-sm font-semibold text-gray-700 hidden sm:block">Map</span>
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0C1330] focus:ring-offset-2 ${showMap ? 'bg-[#0C1330]' : 'bg-gray-300'}`}
                            aria-label="Toggle map"
                        >
                            <span className={`${showMap ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;
