# Environment Variables Configuration

This document explains all environment variables required for the CaravaGo application.

## Important Notes
- All environment variables in the frontend **must be prefixed with `VITE_`** to be accessible in the browser
- Create a `.env` file in the frontend root directory
- Restart the development server after changing environment variables

## Backend Environment Variables (.env)

Create a `.env` file in the backend root directory with the following variables:

### Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

### JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

### API Key Configuration
CARAVAGO_API=caravago_api_key_here

### Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

### Server Configuration
PORT=4000

# Backend API URL
VITE_API_URL=http://localhost:4000/api

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000

# Frontend server port (optional, defaults to 3000)
FRONTEND_PORT=3000

# Note: API keys are handled server-side only via proxy
# Frontend communicates with backend via JWT authentication
# Backend proxies external API calls with CARAVAGO_API key
