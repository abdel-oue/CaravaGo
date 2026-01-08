import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Step1BasicInfo = ({
    formData,
    errors,
    updateFormData,
    query,
    setQuery,
    suggestions,
    locationLoading,
    selectedLocation,
    selectLocation,
    showDropdown,
    handleInputFocus,
    handleInputBlur
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-lexend">Basic Information</h3>
                <p className="text-gray-600 mb-6">Let's start with the essentials about your vehicle.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Vehicle Title *</label>
                    <input
                        type="text"
                        placeholder="e.g., Cozy Campervan for City Adventures"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Vehicle Type *</label>
                    <select
                        value={formData.vehicleType}
                        onChange={(e) => updateFormData('vehicleType', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select vehicle type</option>
                        <option value="campervan">Campervan</option>
                        <option value="large-campervan">Large Campervan</option>
                        <option value="motorhome">Motorhome</option>
                        <option value="low-profile">Low Profile Motorhome</option>
                        <option value="coachbuilt">Coachbuilt Motorhome</option>
                    </select>
                    {errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>}
                </div>

                <div className="relative">
                    <label className="block text-sm font-bold text-gray-800 mb-2">Location *</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Choose Moroccan city"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors.location ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        {locationLoading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary"></div>
                            </div>
                        )}
                    </div>

                    {/* Autocomplete Dropdown */}
                    {showDropdown && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] max-h-60 overflow-y-auto mt-1">
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

                    {selectedLocation && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center text-green-800 text-sm">
                                <FaMapMarkerAlt className="mr-2" />
                                Selected: {selectedLocation.city}, {selectedLocation.country}
                            </div>
                        </div>
                    )}

                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Year</label>
                    <input
                        type="number"
                        placeholder="2020"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        value={formData.year}
                        onChange={(e) => updateFormData('year', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent border-gray-300`}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Description *</label>
                <textarea
                    rows="4"
                    placeholder="Describe your vehicle, its features, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
        </motion.div>
    );
};

export default Step1BasicInfo;