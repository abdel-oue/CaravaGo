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

The server will start on the port specified in your `.env` file (default: 5000).

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Authenticate user | Public |
| GET | `/me` | Get current user info | Private |

### Request/Response Examples

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json
x-api-key: your_api_key_here

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
x-api-key: your_api_key_here

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

## API Key Authentication

All POST requests require the CaravaGo API key to be included in the request headers:

```javascript
headers: {
  'x-api-key': 'your_caravago_api_key_here'
}
```

The API key must match the value specified in the `CARAVAGO_API_KEY` environment variable.

## Contributing

1. Follow the existing code style and structure
2. Add proper error handling
3. Update documentation for new features
4. Test endpoints thoroughly

## License

This project is part of the CaravaGo application.
