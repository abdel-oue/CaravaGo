# Upload Test Page

A comprehensive testing page for all file upload functionality in CaravaGo.

## Access the Test Page

1. Start both backend and frontend servers:
   ```bash
   # Backend (Terminal 1)
   cd backend && npm run dev

   # Frontend (Terminal 2)
   cd frontend && npm run dev
   ```

2. Navigate to `http://localhost:5173/upload-test` in your browser

## Features Tested

### 1. Profile Picture Upload
- **Endpoint**: `POST /api/upload/profile`
- **Functionality**:
  - Single file upload
  - File type validation (images only)
  - File size limit (5MB)
  - Automatic user folder creation
  - Updates user avatar_url in database

### 2. Single Image Upload
- **Endpoint**: `POST /api/upload/image`
- **Functionality**:
  - Upload single image with title
  - Type categorization (general, vehicle, etc.)
  - Returns file path for database storage

### 3. Multiple Images Upload
- **Endpoint**: `POST /api/upload/images`
- **Functionality**:
  - Upload up to 10 images simultaneously
  - Batch processing
  - Returns array of uploaded file data

### 4. File Deletion
- **Endpoint**: `DELETE /api/upload/file`
- **Functionality**:
  - Delete files from filesystem
  - User permission validation
  - Automatic database cleanup

### 5. Static File Serving
- **URL Pattern**: `http://localhost:4000/uploads/user_<id>/<filename>`
- **Functionality**:
  - Serve uploaded images
  - Proper MIME types
  - Security headers

## Testing Instructions

1. **Profile Picture Upload**:
   - Select an image file (JPG, PNG, etc.)
   - Click "Upload Profile Picture"
   - Check that the image appears in "Current Profile Picture" section

2. **Single Image Upload**:
   - Select any image
   - Click "Upload Single Image"
   - Image should appear in the "Uploaded Images" grid

3. **Multiple Images Upload**:
   - Select multiple images (hold Ctrl/Cmd to select multiple)
   - Click "Upload X Images"
   - All images should appear in the grid

4. **Delete Images**:
   - Hover over any uploaded image
   - Click the red trash icon
   - Image should disappear from the grid

## File Structure Created

```
backend/uploads/
├── user_1/
│   ├── profile_1735689600000_123456789.jpg
│   ├── image1_1735689600001_123456790.jpg
│   └── image2_1735689600002_123456791.jpg
├── user_2/
│   └── profile_1735689600003_123456792.png
└── ...
```

## Security Features Verified

- ✅ Authentication required for all uploads
- ✅ User isolation (files in separate folders)
- ✅ File type validation
- ✅ File size limits
- ✅ Unique filename generation
- ✅ Path traversal protection

## API Response Examples

### Successful Upload
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "path": "/uploads/user_1/profile_1735689600000_123456789.jpg",
  "filename": "profile_1735689600000_123456789.jpg"
}
```

### Error Response
```json
{
  "message": "Only image files are allowed!"
}
```

## Troubleshooting

**Upload fails with 401 error:**
- Make sure you're logged in
- Check JWT token validity

**Images not displaying:**
- Verify backend is running on port 4000
- Check file permissions in uploads folder
- Ensure static file serving is configured

**Large files rejected:**
- Maximum file size is 5MB per file
- Multiple files: 5MB per file, max 10 files

**Wrong file type:**
- Only image files accepted (jpg, png, gif, webp)

## Integration with App

This test page demonstrates how to integrate file uploads into your application:

- **CreateListing**: Upload vehicle images
- **Profile**: Update user avatar
- **VehicleDetails**: Display uploaded photos
- **Search**: Show vehicle thumbnails

The upload API is ready for production use! 🚀