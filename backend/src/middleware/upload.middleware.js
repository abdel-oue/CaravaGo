import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage configuration for user uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user._id; // Assume logged-in user is in req.user
    const dir = path.join(__dirname, '../../uploads', `user_${userId}`);

    // Create folder if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);

    // Clean filename and add timestamp
    const cleanBasename = basename.replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${cleanBasename}_${uniqueSuffix}${extension}`);
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Helper function to get file path for database storage
export const getFilePath = (userId, filename) => {
  return `/uploads/user_${userId}/${filename}`;
};

// Helper function to delete file from filesystem
export const deleteFile = (filePath) => {
  try {
    // Remove leading slash if present
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    const fullPath = path.join(__dirname, '../../', cleanPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};