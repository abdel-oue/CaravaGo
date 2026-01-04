# CaravaGo Backend

Backend API for the CaravaGo application built with Express.js and Supabase.

## Features

- User authentication (register, login)
- JWT-based authorization
- Supabase database integration
- Password hashing with bcrypt
- Input validation

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **CORS**: Enabled for cross-origin requests

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Copy the required environment variables from `../docs/env.md`
   - Create a `.env` file in the backend root directory

5. Set up Supabase database:
   - Create a Supabase project
   - Run the SQL schema from `../docs/env.md` in your Supabase SQL Editor

### Running the Application

#### Development
```bash
npm run dev
```

#### Production
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 4000).

## API Endpoints

### Authentication Routes (`/api/auth`) - JWT Protected

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Authenticate user | Public |
| GET | `/me` | Get current user info | Private (JWT) |

### External API Routes (`/api/external`) - API Key Protected

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/caravago-data` | External API data | Private (API Key) |

### Request/Response Examples

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Supabase database connection
│   ├── controllers/
│   │   └── auth.controller.js # Authentication logic
│   ├── middleware/
│   │   └── auth.middleware.js # JWT authentication middleware
│   ├── models/
│   │   └── User.js            # User service for Supabase operations
│   ├── routes/
│   │   └── auth.routes.js     # Authentication routes
│   └── server.js              # Main server file
├── package.json
└── README.md
```

## Error Handling

The API uses consistent error response formats:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials or missing token)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- API key authentication for POST requests
- Input validation and sanitization
- CORS enabled for frontend communication
- Row Level Security (RLS) enabled in Supabase

## Security Architecture

### Proxy-Based Security Model
```
Frontend ──JWT──▶ Backend ──API Key──▶ CaravaGo API
```

### Frontend Authentication (JWT-based)
Frontend authentication routes (`/api/auth/*`) use **JWT tokens** for security:
- **No API key required** for signup, login, and user data retrieval
- **JWT tokens** are issued upon successful authentication
- **Bearer token** authentication for protected routes

### External API Proxy (API Key-based)
External API calls are proxied through the backend with **CaravaGo API key**:
- **API key stored server-side only** (never exposed to frontend)
- **Secure proxy requests** to external CaravaGo API
- **Backend validates and forwards** all external API calls

### Request Flow
1. **Frontend** → Makes request to `/api/external/*`
2. **Backend** → Validates request (JWT for auth, API key for external)
3. **Backend** → Makes secure call to CaravaGo API with `CARAVAGO_API` key
4. **Backend** → Returns sanitized response to frontend

## Contributing

1. Follow the existing code style and structure
2. Add proper error handling
3. Update documentation for new features
4. Test endpoints thoroughly

## License

This project is part of the CaravaGo application.
