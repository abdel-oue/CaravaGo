import { motion } from 'framer-motion';
import { useAmenities } from '../../hooks/useVehicleTypes'

const Step2Details = ({ formData, errors, updateFormData }) => {
    const { amenities, loading: amenitiesLoading } = useAmenities();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-lexend">Vehicle Details</h3>
                <p className="text-gray-600 mb-6">Help travelers understand what your vehicle offers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Make</label>
                    <input
                        type="text"
                        placeholder="e.g., Volkswagen"
                        value={formData.make}
                        onChange={(e) => updateFormData('make', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Model</label>
                    <input
                        type="text"
                        placeholder="e.g., California"
                        value={formData.model}
                        onChange={(e) => updateFormData('model', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Sleeps *</label>
                    <input
                        type="number"
                        placeholder="4"
                        min="1"
                        max="20"
                        value={formData.sleeps}
                        onChange={(e) => updateFormData('sleeps', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.sleeps ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.sleeps && <p className="text-red-500 text-sm mt-1">{errors.sleeps}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Length (meters)</label>
                    <input
                        type="number"
                        placeholder="6.5"
                        step="0.1"
                        min="1"
                        max="20"
                        value={formData.length}
                        onChange={(e) => updateFormData('length', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
                    </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Features & Amenities</label>
                {amenitiesLoading ? (
                    <div className="text-sm text-gray-500">Loading amenities...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {amenities.map((amenity) => (
                            <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.amenities.includes(amenity.id)}
                                    onChange={(e) => {
                                        const newAmenities = e.target.checked
                                            ? [...formData.amenities, amenity.id]
                                            : formData.amenities.filter(a => a !== amenity.id);
                                        updateFormData('amenities', newAmenities);
                                    }}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-gray-700">{amenity.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Step2Details;