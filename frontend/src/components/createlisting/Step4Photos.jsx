import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaTrash, FaSpinner, FaCheck } from 'react-icons/fa';
import { uploadImages, deleteUploadedFile, getImageUrl } from '../../api/upload.js';

const Step4Photos = ({ formData, errors, updateFormData }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadErrors, setUploadErrors] = useState({});
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleFileSelect = async (files) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        setUploadErrors({});

        try {
            // First, add the files to local state for immediate display
            const fileObjects = files.map(file => ({
                id: Date.now() + Math.random(),
                file: file,
                originalName: file.name,
                size: file.size,
                mimetype: file.type,
                uploaded: false,
                uploading: true
            }));

            const tempPhotos = [...formData.photos, ...fileObjects];
            updateFormData('photos', tempPhotos);

            // Then upload to backend
            const uploadedImages = await uploadImages(files, 'listing');

            // Update the uploaded photos with server data
            const updatedPhotos = tempPhotos.map(photo => {
                if (photo.uploading) {
                    const uploaded = uploadedImages.images.find(
                        img => img.originalName === photo.originalName
                    );
            
                    if (uploaded) {
                        return {
                            id: photo.id,
                            path: uploaded.path,
                            filename: uploaded.filename,
                            originalName: uploaded.originalName,
                            size: uploaded.size,
                            mimetype: uploaded.mimetype,
                            uploaded: true,
                            uploading: false
                        };
                    }
                }
                return photo;
            });            

            updateFormData('photos', updatedPhotos);
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadErrors({ general: error.message || 'Failed to upload photos. Please try again.' });

            // Remove failed uploads from the list
            const filteredPhotos = formData.photos.filter(photo => !photo.uploading);
            updateFormData('photos', filteredPhotos);
        } finally {
            setUploading(false);
        }
    };

    const handleFileInputChange = (e) => {
        e.preventDefault();
        e.stopPropagation(); // IMPORTANT
        const files = Array.from(e.target.files);
        handleFileSelect(files);
        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation(); // IMPORTANT
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            handleFileSelect(files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation(); // IMPORTANT
    };

    const removePhoto = async (index) => {
        
        const photo = formData.photos[index];

        // If photo was uploaded to backend, delete it from server
        if (photo.uploaded && photo.path) {
            try {
                await deleteUploadedFile(photo.path);
            } catch (error) {
                console.error('Failed to delete photo from server:', error);
                // Continue with local removal even if server deletion fails
            }
        }

        // Remove from local state
        const newPhotos = formData.photos.filter((_, i) => i !== index);
        updateFormData('photos', newPhotos);
    };

    const handlePhotoDragStart = (e, index) => {
        e.preventDefault();
        e.stopPropagation(); // IMPORTANT
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handlePhotoDragOver = (e, index) => {
        e.preventDefault();
        e.stopPropagation(); // IMPORTANT
        e.dataTransfer.dropEffect = 'move';
    };

    const handlePhotoDrop = (e, dropIndex) => {
        e.preventDefault();
        e.stopPropagation(); // IMPORTANT
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }

        const newPhotos = [...formData.photos];
        const draggedPhoto = newPhotos[draggedIndex];

        // Remove dragged item
        newPhotos.splice(draggedIndex, 1);
        // Insert at new position
        newPhotos.splice(dropIndex, 0, draggedPhoto);

        updateFormData('photos', newPhotos);
        setDraggedIndex(null);
    };

    const handlePhotoDragEnd = () => {
        setDraggedIndex(null);
    };

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
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        uploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {uploading ? (
                        <>
                            <FaSpinner className="mx-auto text-3xl text-blue-500 mb-4 animate-spin" />
                            <p className="text-blue-600 mb-4">Uploading photos...</p>
                        </>
                    ) : (
                        <>
                            <FaUpload className="mx-auto text-3xl text-gray-400 mb-4" />
                            <p className="text-gray-600 mb-4">
                                Drag and drop photos here, or click to select files
                            </p>
                        </>
                    )}
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInputChange}
                        disabled={uploading}
                        className="hidden"
                        id="photo-upload"
                    />
                    <label
                        htmlFor="photo-upload"
                        className={`inline-block px-6 py-3 rounded-lg cursor-pointer transition-colors ${
                            uploading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                    >
                        Choose Files
                    </label>
                </div>
                {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
                {uploadErrors.general && <p className="text-red-500 text-sm mt-1">{uploadErrors.general}</p>}
            </div>

            {formData.photos.length > 0 && (
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                        Photos ({formData.photos.filter(p => p.uploaded).length}/{formData.photos.length})
                        {uploading && <span className="text-blue-500 ml-2">Uploading...</span>}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.photos.map((photo, index) => (
                            <div
                                key={photo.id || index}
                                draggable
                                onDragStart={(e) => handlePhotoDragStart(e, index)}
                                onDragOver={(e) => handlePhotoDragOver(e, index)}
                                onDrop={(e) => handlePhotoDrop(e, index)}
                                onDragEnd={handlePhotoDragEnd}
                                className={`relative group cursor-move ${
                                    draggedIndex === index ? 'opacity-50' : ''
                                }`}
                            >
                                <img
                                    src={photo.uploaded ? getImageUrl(photo.path) : URL.createObjectURL(photo.file || photo)}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                    onError={(e) => {
                                        console.error('Failed to load image:', photo.path || photo.originalName || photo.name);
                                        e.target.src = 'https://via.placeholder.com/200x150/cccccc/666666?text=No+Image';
                                    }}
                                />
                                {photo.uploaded && !photo.uploading && (
                                    <div className="absolute top-1 left-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                        <FaCheck className="text-xs" />
                                    </div>
                                )}
                                {photo.uploading && (
                                    <div className="absolute top-1 left-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                        <FaSpinner className="text-xs animate-spin" />
                                    </div>
                                )}
                                <div className="absolute top-1 right-1 flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(index)}
                                        disabled={uploading}
                                        className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                                    >
                                        <FaTrash className="text-xs" />
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                    {photo.originalName || photo.file?.name || photo.name}
                                </div>
                                {/* Drag indicator */}
                                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
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
                    <li>• Photos will be uploaded automatically when selected</li>
                    <li>• Drag and drop photos to reorder them</li>
                </ul>
            </div>
        </motion.div>
    );
};

export default Step4Photos;