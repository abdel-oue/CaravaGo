# Environment Variables Configuration

This document explains all environment variables required for the CaravaGo application.

## Backend Environment Variables (.env)

Create a `.env` file in the backend root directory with the following variables:

### Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

### JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

### API Key Configuration
CARAVAGO_API_KEY=caravago_api_key_here

# Backend API URL
VITE_API_URL=http://localhost:5000/api

# API Key for backend authentication (must match CARAVAGO_API_KEY in backend)
VITE_API_KEY=caravago_api_key_here

# CaravaGo API needs to be available to make every post/get request (Contact Abdelaziz for the API)
CARAVAGO_API=api_key_here
