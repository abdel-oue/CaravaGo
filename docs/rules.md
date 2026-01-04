# CaravaGo Project Rules

## Logging Standards
- **[FRONT] [ERROR]** - Frontend error messages (user-friendly)
- **[FRONT] [SUCCESS]** - Frontend success operations
- **[FRONT] [INFO]** - Frontend informational messages
- **[FRONT] [WARNING]** - Frontend warning messages
- **[BACK] [ERROR]** - Backend error messages (detailed for debugging)
- **[BACK] [SUCCESS]** - Backend successful operations
- **[BACK] [INFO]** - Backend informational messages
- **[BACK] [WARNING]** - Backend warning messages
- **[DB] [ERROR]** - Database operation errors
- **[DB] [SUCCESS]** - Database operation successes
- **[AUTH] [ERROR]** - Authentication errors
- **[AUTH] [SUCCESS]** - Authentication successes

## Code Standards
- Use ES6+ features and async/await
- Consistent error handling with try/catch
- Environment variables for all configuration
- Input validation on both frontend and backend
- TypeScript-like JSDoc comments for complex functions

## Security Rules
- **Proxy Architecture**: Frontend → Backend → External APIs
- **Frontend authentication** uses JWT tokens (no API keys exposed to client)
- **External API calls** require CARAVAGO_API key (server-side only via proxy)
- **API keys are never exposed** to frontend/client-side code
- Passwords must be hashed with bcrypt
- JWT tokens for authenticated requests
- Input sanitization and validation
- CORS properly configured for frontend access
- HTTPS required for production
- No sensitive data in logs

## API Rules
- RESTful endpoints with consistent naming
- JSON responses with proper HTTP status codes
- Error responses include error codes and messages
- API versioning strategy (future-proofing)
- Rate limiting consideration

## Frontend Rules
- React functional components with hooks
- Consistent styling with Tailwind CSS
- Responsive design (mobile-first)
- Loading states for all async operations
- Error boundaries for crash prevention
- Accessibility considerations

## Backend Rules
- Express.js with middleware architecture
- Supabase for database operations
- JWT authentication middleware
- API key validation middleware
- Structured error responses
- Environment-based configuration

## Database Rules
- Supabase PostgreSQL with RLS enabled
- Consistent table naming conventions
- Foreign key relationships properly defined
- Data validation at database level
- Backup and recovery strategies

## Testing Rules
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test coverage minimum 80%
- Automated testing in CI/CD pipeline

## Deployment Rules
- Environment-specific configurations
- Docker containerization
- Health check endpoints
- Monitoring and logging setup
- Rollback strategies

## Documentation Rules
- README files for all major components
- API documentation with examples
- Environment variable documentation
- Setup and deployment guides
- Code comments for complex logic
