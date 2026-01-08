import React, { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaCheck, FaTimes, FaImage, FaUser } from 'react-icons/fa';
import {
  uploadProfilePicture,
  uploadImage,
  uploadImages,
  deleteUploadedFile,
  getImageUrl
} from '../api/upload';

const UploadTest = () => {
  const [profileFile, setProfileFile] = useState(null);
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Mock user data for testing
  const mockUser = {
    _id: 'test_user_123',
    name: 'Test User',
    email: 'test@example.com',
    avatar_url: '/uploads/test_user_123/profile.jpg'
  };

  useEffect(() => {
    // Load some mock uploaded images for testing
    const mockImages = [
      '/uploads/test_user_123/image1.jpg',
      '/uploads/test_user_123/image2.jpg',
      '/uploads/test_user_123/image3.jpg'
    ];
    setUploadedImages(mockImages);
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleProfileUpload = async () => {
    if (!profileFile) {
      showMessage('Please select a profile picture first', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await uploadProfilePicture(profileFile);
      showMessage('Profile picture uploaded successfully!');
      setProfileFile(null);

      // Reset file input
      const input = document.getElementById('profile-input');
      if (input) input.value = '';
    } catch (error) {
      showMessage(error.message || 'Failed to upload profile picture', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSingleImageUpload = async () => {
    if (!singleFile) {
      showMessage('Please select an image first', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await uploadImage(singleFile, 'Test Image', 'general');
      showMessage('Image uploaded successfully!');
      setSingleFile(null);

      // Add to uploaded images list
      setUploadedImages(prev => [...prev, result.path]);

      // Reset file input
      const input = document.getElementById('single-input');
      if (input) input.value = '';
    } catch (error) {
      showMessage(error.message || 'Failed to upload image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleImagesUpload = async () => {
    if (multipleFiles.length === 0) {
      showMessage('Please select images first', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await uploadImages(multipleFiles, 'test');
      showMessage(`${result.images.length} images uploaded successfully!`);

      // Add to uploaded images list
      const newPaths = result.images.map(img => img.path);
      setUploadedImages(prev => [...prev, ...newPaths]);

      setMultipleFiles([]);

      // Reset file input
      const input = document.getElementById('multiple-input');
      if (input) input.value = '';
    } catch (error) {
      showMessage(error.message || 'Failed to upload images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imagePath) => {
    setLoading(true);
    try {
      await deleteUploadedFile(imagePath);
      showMessage('Image deleted successfully!');

      // Remove from uploaded images list
      setUploadedImages(prev => prev.filter(img => img !== imagePath));
    } catch (error) {
      showMessage(error.message || 'Failed to delete image', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            File Upload Test Page
          </h1>
          <p className="text-gray-600">
            Test all upload functionality: profile pictures, single images, and multiple images
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {messageType === 'success' ? (
                <FaCheck className="mr-2" />
              ) : (
                <FaTimes className="mr-2" />
              )}
              {message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Forms */}
          <div className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <FaUser className="text-blue-500 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Picture Upload
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Profile Picture
                  </label>
                  <input
                    id="profile-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileFile(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {profileFile && (
                  <div className="flex items-center space-x-3">
                    <img
                      src={URL.createObjectURL(profileFile)}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <span className="text-sm text-gray-600">{profileFile.name}</span>
                  </div>
                )}

                <button
                  onClick={handleProfileUpload}
                  disabled={!profileFile || loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FaUpload className="mr-2" />
                  {loading ? 'Uploading...' : 'Upload Profile Picture'}
                </button>
              </div>
            </div>

            {/* Single Image Upload */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <FaImage className="text-green-500 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Single Image Upload
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Image
                  </label>
                  <input
                    id="single-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSingleFile(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {singleFile && (
                  <div className="flex items-center space-x-3">
                    <img
                      src={URL.createObjectURL(singleFile)}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="text-sm text-gray-600">{singleFile.name}</span>
                  </div>
                )}

                <button
                  onClick={handleSingleImageUpload}
                  disabled={!singleFile || loading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FaUpload className="mr-2" />
                  {loading ? 'Uploading...' : 'Upload Single Image'}
                </button>
              </div>
            </div>

            {/* Multiple Images Upload */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <FaImage className="text-purple-500 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Multiple Images Upload
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Multiple Images
                  </label>
                  <input
                    id="multiple-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setMultipleFiles(Array.from(e.target.files))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {multipleFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {multipleFiles.map((file, index) => (
                      <div key={index} className="text-center">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-16 h-16 object-cover rounded mx-auto"
                        />
                        <span className="text-xs text-gray-500 block mt-1">
                          {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleMultipleImagesUpload}
                  disabled={multipleFiles.length === 0 || loading}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FaUpload className="mr-2" />
                  {loading ? 'Uploading...' : `Upload ${multipleFiles.length} Images`}
                </button>
              </div>
            </div>
          </div>

          {/* Uploaded Images Display */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Uploaded Images
            </h2>

            {uploadedImages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No images uploaded yet. Upload some images to see them here!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {uploadedImages.map((imagePath, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getImageUrl(imagePath)}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x150/cccccc/666666?text=No+Image';
                      }}
                    />
                    <button
                      onClick={() => handleDeleteImage(imagePath)}
                      disabled={loading}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                    >
                      <FaTrash size={12} />
                    </button>
                    <div className="mt-2 text-xs text-gray-500 truncate">
                      {imagePath.split('/').pop()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Current Profile Picture */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Current Profile Picture
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src={getImageUrl(mockUser.avatar_url)}
                  alt="Current Profile"
                  className="w-16 h-16 object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/64x64/cccccc/666666?text=No+Profile';
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
                  <p className="text-sm text-gray-500">{mockUser.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints Info */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            API Endpoints Tested
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900">Profile Upload</h3>
              <code className="text-blue-600">POST /api/upload/profile</code>
              <p className="text-gray-600 mt-1">Single file upload for profile pictures</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Single Image Upload</h3>
              <code className="text-green-600">POST /api/upload/image</code>
              <p className="text-gray-600 mt-1">Upload single image with title and type</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Multiple Images Upload</h3>
              <code className="text-purple-600">POST /api/upload/images</code>
              <p className="text-gray-600 mt-1">Upload up to 10 images at once</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Delete File</h3>
              <code className="text-red-600">DELETE /api/upload/file</code>
              <p className="text-gray-600 mt-1">Delete uploaded files</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTest;