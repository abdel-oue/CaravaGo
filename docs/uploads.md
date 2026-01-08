# File Upload System Documentation

This document explains the file upload system implemented for CaravaGo, which allows users to upload profile pictures, vehicle images, and other media files.

## 📁 Folder Structure

```
backend/
├── uploads/
│   ├── user_<userId1>/
│   │   ├── profile.jpg
│   │   ├── vehicle1.jpg
│   │   └── vehicle2.jpg
│   ├── user_<userId2>/
│   │   ├── profile.png
│   │   └── listing_photo.jpg
│   └── ...
```

Each user gets their own folder (`user_<userId>`) to prevent filename collisions and organize files by owner.

## 🛠 Backend Implementation

### Dependencies Added
- `multer@^1.4.5-lts.1` - For handling multipart/form-data uploads

### Middleware (`backend/src/middleware/upload.middleware.js`)
- Configures multer storage with dynamic user folder creation
- Handles file naming with timestamps to prevent collisions
- Filters file types to allow only images
- Provides utility functions for file operations

### Routes (`backend/src/routes/upload.routes.js`)
- `POST /api/upload/profile` - Upload profile picture (single file)
- `POST /api/upload/image` - Upload general image (single file)
- `POST /api/upload/images` - Upload multiple images (up to 10 files)
- `DELETE /api/upload/file` - Delete uploaded file

### Server Configuration
- Static file serving added: `app.use('/uploads', express.static('uploads'))`
- Files are accessible at: `http://localhost:4000/uploads/user_<id>/<filename>`

## 🎨 Frontend Implementation

### API Service (`frontend/src/api/upload.js`)
```javascript
import { uploadProfilePicture, uploadImage, uploadImages, getImageUrl } from '../api/upload';

// Upload profile picture
const result = await uploadProfilePicture(file);

// Upload single image
const result = await uploadImage(file, 'My Vehicle', 'vehicle');

// Upload multiple images
const result = await uploadImages([file1, file2, file3], 'listing');

// Get full URL for display
const imageUrl = getImageUrl('/uploads/user_1/profile.jpg');
```

### Usage Examples

#### Profile Picture Upload
```javascript
const handleProfileUpload = async (file) => {
  try {
    const result = await uploadProfilePicture(file);
    // result.path contains the file path for database storage
    // result.user contains updated user data
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

#### Vehicle Image Upload
```javascript
const handleVehicleImageUpload = async (files) => {
  try {
    const result = await uploadImages(files, 'vehicle');
    // result.images contains array of uploaded image data
    const imageUrls = result.images.map(img => img.path);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

#### Displaying Images
```jsx
// In React component
<img src={getImageUrl(user.avatar_url)} alt="Profile" />
<img src={getImageUrl(vehicle.image)} alt="Vehicle" />
```

## 🔒 Security Features

- **User Isolation**: Files are stored in user-specific folders
- **Authentication Required**: All upload routes require valid JWT token
- **File Type Validation**: Only image files are accepted
- **File Size Limits**: 5MB maximum per file
- **Path Validation**: Users can only delete files from their own folders

## 📝 API Response Format

### Single File Upload Response
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "path": "/uploads/user_1/profile_1735689600000_123456789.jpg",
  "filename": "profile_1735689600000_123456789.jpg",
  "originalName": "my-profile.jpg",
  "title": "Profile Picture"
}
```

### Multiple Files Upload Response
```json
{
  "success": true,
  "message": "3 images uploaded successfully",
  "images": [
    {
      "path": "/uploads/user_1/image1.jpg",
      "filename": "image1.jpg",
      "originalName": "vehicle1.jpg",
      "size": 245760,
      "mimetype": "image/jpeg"
    }
  ]
}
```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**: Ensure your `.env` file has the correct database and JWT configurations.

3. **File Permissions**: Make sure the backend has write permissions to the `uploads/` directory.

4. **Frontend Integration**: Use the upload API functions in your React components for file uploads.

## 🔧 Configuration Options

### File Size Limits
- Single file: 5MB
- Multiple files: 5MB per file, max 10 files

### Allowed File Types
- Images only: `image/*` MIME types
- Extensions: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

### Naming Convention
- Files are renamed with timestamp: `originalname_timestamp_random.jpg`
- Example: `profile_1735689600000_123456789.jpg`

## 🗑️ Cleanup

Files can be deleted using the `deleteUploadedFile` function:
```javascript
await deleteUploadedFile('/uploads/user_1/old_profile.jpg');
```

This will remove the file from the filesystem and update the database if it's a profile picture.

## 📊 Database Integration

- Profile pictures are stored in the `avatar_url` field of the users collection
- Vehicle/listing images should be stored in your listings or images collections
- File paths are stored as relative URLs (e.g., `/uploads/user_1/image.jpg`)

## 🐛 Troubleshooting

**Common Issues:**

1. **403 Forbidden**: Check if user is authenticated
2. **File not found**: Verify the file path and user permissions
3. **Upload fails**: Check file size limits and network connectivity
4. **Images not displaying**: Ensure static file serving is configured correctly

**Debug Tips:**
- Check browser network tab for upload requests
- Verify JWT token is included in request headers
- Check server logs for multer errors
- Ensure uploads folder has correct permissions