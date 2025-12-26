# CaravaGo

A MERN stack application with authentication system.

## Project Structure

```
mern-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── pages/
│   │   │   ├── Signin.jsx
│   │   │   └── Signup.jsx
│   │   ├── components/
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── hooks/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string and JWT secret:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your API URL (if different from default):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Dependencies

All dependencies are listed in `requirements.txt`. The project uses:

### Backend
- Express.js - Web framework
- MongoDB with Mongoose - Database
- JWT - Authentication
- bcrypt - Password hashing
- dotenv - Environment variables

### Frontend
- React - UI library
- React Router - Routing
- Axios - HTTP client
- Tailwind CSS - Styling
- Vite - Build tool

## Features

- User registration
- User login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt