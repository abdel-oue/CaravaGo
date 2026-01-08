import axios from './axios.js';

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profile', file);

    const response = await axios.post('/upload/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Upload single image
export const uploadImage = async (file, title = '', type = 'general') => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    if (title) formData.append('title', title);
    formData.append('type', type);

    const response = await axios.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Upload multiple images
export const uploadImages = async (files, type = 'listing') => {
  try {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append('images', file);
    });

    formData.append('type', type);

    const response = await axios.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete uploaded file
export const deleteUploadedFile = async (filePath) => {
  try {
    const response = await axios.delete('/upload/file', {
      data: { filePath }
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get full URL for uploaded image
export const getImageUrl = (path) => {
  if (!path) return null;

  // If path already includes protocol, return as is
  if (path.startsWith('http')) {
    return path;
  }

  // Remove leading slash if present and construct full URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${cleanPath}`;
};