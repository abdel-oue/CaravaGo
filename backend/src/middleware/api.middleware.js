// Middleware to validate API key for POST requests
export const validateApiKey = (req, res, next) => {
  // Only check API key for POST requests
  if (req.method !== 'POST') {
    return next();
  }

  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  // Check if API key is provided
  if (!apiKey) {
    return res.status(401).json({
      message: 'CaravaGo API key required for this operation',
      error: 'MISSING_API_KEY'
    });
  }

  // Check if API key matches the CaravaGo API key
  const caravaGoApiKey = process.env.CARAVAGO_API_KEY;

  if (!caravaGoApiKey) {
    console.error('CARAVAGO_API_KEY environment variable is not set');
    return res.status(500).json({
      message: 'Server configuration error',
      error: 'SERVER_CONFIG_ERROR'
    });
  }

  if (apiKey !== caravaGoApiKey) {
    return res.status(403).json({
      message: 'Invalid CaravaGo API key',
      error: 'INVALID_API_KEY'
    });
  }

  // API key is valid, proceed
  next();
};
