import { FaCar } from 'react-icons/fa';

const ListingSummary = ({ formData, selectedLocation }) => {
    return (
        <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Listing Summary</h3>

                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <FaCar className="text-white text-xs" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{formData.title || 'No title set'}</div>
                            <div className="text-sm text-gray-500">{formData.vehicleType || 'No type selected'}</div>
                            <div className="text-sm text-gray-500">
                                {selectedLocation ? `${selectedLocation.city}, ${selectedLocation.country}` : 'No location set'}
                            </div>
                        </div>
                    </div>

                    {formData.dailyRate && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-sm text-gray-600">Daily Rate</span>
                            <span className="font-bold text-primary">{formData.currency} {formData.dailyRate}</span>
                        </div>
                    )}

                    {formData.photos.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600 mb-2">Photos ({formData.photos.length})</div>
                            <div className="grid grid-cols-3 gap-2">
                                {formData.photos.slice(0, 3).map((photo, index) => (
                                    <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt={`Photo ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListingSummary;