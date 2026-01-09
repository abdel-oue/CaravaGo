# CaravaGo API Documentation for Postman

## Base URL
```
http://localhost:4000
```

## Authentication
Most protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Routes (`/api/auth`)

### 1. Register User
**POST** `/api/auth/register`
- **Access**: Public
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "avatar_url": "https://example.com/avatar.jpg",
  "phone": "+1234567890",
  "bio": "User bio",
  "is_owner": false
}
```

### 2. Verify Email
**POST** `/api/auth/verify-email`
- **Access**: Public
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "token": "verification_token_here"
}
```
OR
```json
{
  "code": "123456"
}
```

### 3. Login
**POST** `/api/auth/login`
- **Access**: Public
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "celinoantunez@gmail.com",
  "password": "simosimo"
}
```

### 4. Verify Token
**POST** `/api/auth/verify-token`
- **Access**: Public
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "token": "jwt_token_here"
}
```

### 5. Forgot Password
**POST** `/api/auth/forgot-password`
- **Access**: Public
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "john@example.com"
}
```

### 6. Reset Password
**POST** `/api/auth/reset-password`
- **Access**: Public
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "token": "reset_token_here",
  "password": "newpassword123"
}
```

---

## 📋 Listing Routes (`/api/listings`)

### 1. Get All Listings
**GET** `/api/listings`
- **Access**: Public
- **Query Parameters**:
  - `status` (optional): Filter by status (e.g., "active", "pending")
  - `vehicle_type_id` (optional): Filter by vehicle type ID
  - `location_city` (optional): Filter by city
  - `location_country` (optional): Filter by country
  - `limit` (optional): Number of results (default: 50)
  - `offset` (optional): Pagination offset (default: 0)
- **Example**: `/api/listings?status=active&limit=10&offset=0`

### 2. Get Listing by ID
**GET** `/api/listings/:id`
- **Access**: Public
- **Path Parameters**:
  - `id`: Listing ID
- **Example**: `/api/listings/123`

### 3. Get My Listings
**GET** `/api/listings/my-listings`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`

### 4. Create Listing
**POST** `/api/listings`
- **Access**: Private (Requires JWT)
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "title": "Beautiful RV for Rent",
  "description": "Spacious RV perfect for family trips",
  "vehicle_type_id": 1,
  "make": "Ford",
  "model": "E-350",
  "year": 2020,
  "sleeps": 4,
  "length_meters": 7.5,
  "location_city": "Paris",
  "location_country": "France",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "daily_rate": 100,
  "currency": "EUR",
  "min_rental_days": 2,
  "max_rental_days": 30,
  "status": "pending",
  "is_featured": false,
  "amenity_ids": [1, 2, 3],
  "photos": ["url1", "url2"]
}
```

### 5. Update Listing
**PUT** `/api/listings/:id`
- **Access**: Private (Requires JWT)
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Path Parameters**:
  - `id`: Listing ID
- **Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "daily_rate": 120,
  "status": "active",
  "amenity_ids": [1, 2, 3, 4],
  "photos": ["url1", "url2", "url3"]
}
```

### 6. Delete Listing
**DELETE** `/api/listings/:id`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`
- **Path Parameters**:
  - `id`: Listing ID
- **Example**: `/api/listings/123`

### 7. Get Vehicle Types
**GET** `/api/listings/vehicle-types`
- **Access**: Public
- **Example**: `/api/listings/vehicle-types`

### 8. Get Amenities
**GET** `/api/listings/amenities`
- **Access**: Public
- **Example**: `/api/listings/amenities`

---

## 👤 Profile Routes (`/api/profile`)

### 1. Update Profile
**PUT** `/api/profile/profile`
- **Access**: Private (Requires JWT)
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body** (at least one field required):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "bio": "Updated bio"
}
```

---

## 📤 Upload Routes (`/api/upload`)

### 1. Upload Profile Picture
**POST** `/api/upload/profile`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Body** (form-data):
  - `profile`: (file) Image file

### 2. Upload Single Image
**POST** `/api/upload/image`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Body** (form-data):
  - `image`: (file) Image file
  - `title` (optional): Image title
  - `type` (optional): Image type (default: "general")

### 3. Upload Multiple Images
**POST** `/api/upload/images`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Body** (form-data):
  - `images`: (file[]) Array of image files (max 10)
  - `type` (optional): Image type (default: "listing")

### 4. Delete Uploaded File
**DELETE** `/api/upload/file`
- **Access**: Private (Requires JWT)
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "filePath": "/uploads/user_123/filename.jpg"
}
```

---

## 👥 User Routes (`/api/user`)

All routes in this section require authentication.

### 1. Get User Bookings
**GET** `/api/user/bookings`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`

### 2. Get User Listings
**GET** `/api/user/listings`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`

### 3. Get User Reviews
**GET** `/api/user/reviews`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`

### 4. Get User Favorites
**GET** `/api/user/favorites`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`

### 5. Get User Messages
**GET** `/api/user/messages`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`

### 6. Get User Notifications
**GET** `/api/user/notifications`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`

### 7. Mark Notification as Read
**PUT** `/api/user/notifications/:id/read`
- **Access**: Private (Requires JWT)
- **Headers**: `Authorization: Bearer <token>`
- **Path Parameters**:
  - `id`: Notification ID
- **Example**: `/api/user/notifications/123/read`

---

## 📍 Location Routes (`/api/locations`)

All routes in this section are public (no authentication required).

### 1. Get All Locations
**GET** `/api/locations`
- **Access**: Public
- **Query Parameters**:
  - `country` (optional): Filter by country
  - `region` (optional): Filter by region
  - `popular` (optional): Filter by popularity (true/false)
  - `search` (optional): Search term
  - `limit` (optional): Number of results
  - `offset` (optional): Pagination offset
  - `sort` (optional): Sort criteria (JSON string)
- **Example**: `/api/locations?country=France&limit=10`

### 2. Get Popular Locations
**GET** `/api/locations/popular`
- **Access**: Public
- **Query Parameters**:
  - `limit` (optional): Number of results (default: 20)
- **Example**: `/api/locations/popular?limit=10`

### 3. Get Locations by Country
**GET** `/api/locations/country/:country`
- **Access**: Public
- **Path Parameters**:
  - `country`: Country name
- **Query Parameters**:
  - `limit` (optional): Number of results
  - `sort` (optional): Sort criteria (JSON string)
- **Example**: `/api/locations/country/France?limit=20`

### 4. Get Locations by Region
**GET** `/api/locations/region/:region`
- **Access**: Public
- **Path Parameters**:
  - `region`: Region name
- **Query Parameters**:
  - `limit` (optional): Number of results
  - `sort` (optional): Sort criteria (JSON string)
- **Example**: `/api/locations/region/Ile-de-France?limit=20`

### 5. Search Locations (Autocomplete)
**GET** `/api/locations/search`
- **Access**: Public
- **Query Parameters**:
  - `q` (required): Search query
  - `limit` (optional): Number of results (default: 10)
- **Example**: `/api/locations/search?q=Paris&limit=5`

### 6. Get Location by ID
**GET** `/api/locations/:id`
- **Access**: Public
- **Path Parameters**:
  - `id`: Location ID
- **Example**: `/api/locations/123`

---

## 📝 Notes for Postman Testing

### Setting up Environment Variables
Create a Postman environment with:
- `base_url`: `http://localhost:4000`
- `token`: Your JWT token (set after login)

### Testing Flow
1. **Register** a new user: `POST /api/auth/register`
2. **Verify email**: `POST /api/auth/verify-email`
3. **Login**: `POST /api/auth/login` (save the token from response)
4. **Set token**: Use the token in Authorization header for protected routes
5. **Create listing**: `POST /api/listings` (with token)
6. **Get listings**: `GET /api/listings` (public, no token needed)

### Common Headers
- **JSON requests**: `Content-Type: application/json`
- **File uploads**: `Content-Type: multipart/form-data` (set automatically by Postman)
- **Protected routes**: `Authorization: Bearer {{token}}`

### Response Format
Most successful responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "message": "Error description"
}
```

---

## 🔄 Quick Reference Table

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/verify-email` | No | Verify email |
| POST | `/api/auth/verify-token` | No | Verify JWT token |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| POST | `/api/auth/reset-password` | No | Reset password |
| GET | `/api/listings` | No | Get all listings |
| GET | `/api/listings/:id` | No | Get listing by ID |
| GET | `/api/listings/my-listings` | Yes | Get user's listings |
| POST | `/api/listings` | Yes | Create listing |
| PUT | `/api/listings/:id` | Yes | Update listing |
| DELETE | `/api/listings/:id` | Yes | Delete listing |
| GET | `/api/listings/vehicle-types` | No | Get vehicle types |
| GET | `/api/listings/amenities` | No | Get amenities |
| PUT | `/api/profile/profile` | Yes | Update profile |
| POST | `/api/upload/profile` | Yes | Upload profile picture |
| POST | `/api/upload/image` | Yes | Upload single image |
| POST | `/api/upload/images` | Yes | Upload multiple images |
| DELETE | `/api/upload/file` | Yes | Delete uploaded file |
| GET | `/api/user/bookings` | Yes | Get user bookings |
| GET | `/api/user/listings` | Yes | Get user listings |
| GET | `/api/user/reviews` | Yes | Get user reviews |
| GET | `/api/user/favorites` | Yes | Get user favorites |
| GET | `/api/user/messages` | Yes | Get user messages |
| GET | `/api/user/notifications` | Yes | Get user notifications |
| PUT | `/api/user/notifications/:id/read` | Yes | Mark notification as read |
| GET | `/api/locations` | No | Get all locations |
| GET | `/api/locations/popular` | No | Get popular locations |
| GET | `/api/locations/country/:country` | No | Get locations by country |
| GET | `/api/locations/region/:region` | No | Get locations by region |
| GET | `/api/locations/search` | No | Search locations |
| GET | `/api/locations/:id` | No | Get location by ID |
