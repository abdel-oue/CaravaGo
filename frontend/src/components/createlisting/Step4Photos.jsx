import { motion } from 'framer-motion';
import { FaUpload, FaTrash } from 'react-icons/fa';

const Step4Photos = ({ formData, errors, updateFormData }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-lexend">Photos</h3>
                <p className="text-gray-600 mb-6">Show off your vehicle with high-quality photos.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Vehicle Photos *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FaUpload className="mx-auto text-3xl text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                        Drag and drop photos here, or click to select files
                    </p>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                            const files = Array.from(e.target.files);
                            updateFormData('photos', [...formData.photos, ...files]);
                        }}
                        className="hidden"
                        id="photo-upload"
                    />
                    <label
                        htmlFor="photo-upload"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark cursor-pointer transition-colors"
                    >
                        Choose Files
                    </label>
                </div>
                {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
            </div>

            {formData.photos.length > 0 && (
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Selected Photos ({formData.photos.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.photos.map((photo, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => {
                                        const newPhotos = formData.photos.filter((_, i) => i !== index);
                                        updateFormData('photos', newPhotos);
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaTrash className="text-xs" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Photo Tips</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Upload at least 5 high-quality photos</li>
                    <li>• Include exterior, interior, and amenities</li>
                    <li>• Show your vehicle in natural lighting</li>
                    <li>• Clean vehicle before taking photos</li>
                </ul>
            </div>
        </motion.div>
    );
};

export default Step4Photos;