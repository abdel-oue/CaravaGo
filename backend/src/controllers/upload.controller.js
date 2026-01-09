import { getFilePath, deleteFile } from '../middleware/upload.middleware.js';
import UserService from '../models/User.js';
import { dbLogger } from '../utils/logger.js';

// Profile picture upload
export const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the file path for database storage
    const filePath = getFilePath(userId, req.file.filename);

    // Update user profile with new avatar URL
    const updatedUser = await UserService.updateProfile(userId, {
      avatar_url: filePath
    });

    dbLogger.success('Profile picture uploaded', {
      user_id: userId,
      file_path: filePath
    });

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      path: filePath,
      user: updatedUser
    });

  } catch (error) {
    dbLogger.error('Profile picture upload failed', { user_id: req.user._id }, error);
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
};

// General image upload (for listings, etc.)
export const uploadImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, type = 'general' } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the file path for database storage
    const filePath = getFilePath(userId, req.file.filename);

    // Here you could save to a separate images collection if needed
    // For now, we'll just return the path for use in listings, etc.

    dbLogger.success('Image uploaded', {
      user_id: userId,
      file_path: filePath,
      type: type
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      path: filePath,
      filename: req.file.filename,
      originalName: req.file.originalname,
      title: title || req.file.originalname
    });

  } catch (error) {
    dbLogger.error('Image upload failed', { user_id: req.user._id }, error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};

// Multiple images upload (for listings with multiple photos)
export const uploadImages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type = 'listing' } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Process all uploaded files
    const uploadedImages = req.files.map(file => ({
      path: getFilePath(userId, file.filename),
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    dbLogger.success('Multiple images uploaded', {
      user_id: userId,
      count: uploadedImages.length,
      type: type
    });

    res.json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      images: uploadedImages
    });

  } catch (error) {
    dbLogger.error('Multiple images upload failed', { user_id: req.user._id }, error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
};

// Delete uploaded file
export const deleteUploadedFile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ message: 'File path is required' });
    }

    // Verify the file belongs to the user (basic security check)
    if (!filePath.includes(`user_${userId}`)) {
      return res.status(403).json({ message: 'Unauthorized to delete this file' });
    }

    const deleted = deleteFile(filePath);

    if (deleted) {
      // If this was a profile picture, clear it from user record
      if (filePath.includes('profile')) {
        await UserService.updateProfile(userId, { avatar_url: null });
      }

      dbLogger.success('File deleted', { user_id: userId, file_path: filePath });
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }

  } catch (error) {
    dbLogger.error('File deletion failed', { user_id: req.user._id }, error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
};