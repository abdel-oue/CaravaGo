import { authLogger } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// Middleware to validate API key for all requests
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  const endpoint = `${req.method} ${req.path}`;
  const clientIP = req.ip || req.connection.remoteAddress;

  // Check if API key is provided
  if (!apiKey) {
    authLogger.warning('API key missing in request', {
      endpoint,
      clientIP,
      headers: req.headers
    });

    return res.status(401).json({
      message: 'CaravaGo API key required for this operation',
      error: 'MISSING_API_KEY'
    });
  }

  // Check if API key matches the CaravaGo API key
  const caravaGoApiKey = process.env.CARAVAGO_API;

  if (!caravaGoApiKey) {
    authLogger.error('CARAVAGO_API environment variable is not configured', {
      endpoint,
      clientIP
    });

    return res.status(500).json({
      message: 'Server configuration error',
      error: 'SERVER_CONFIG_ERROR'
    });
  }

  if (apiKey !== caravaGoApiKey) {
    authLogger.warning('Invalid API key provided', {
      endpoint,
      clientIP,
      providedKey: apiKey.substring(0, 10) + '...' // Log partial key for debugging
    });

    return res.status(403).json({
      message: 'Invalid CaravaGo API key',
      error: 'INVALID_API_KEY'
    });
  }

  authLogger.info('API key validation successful', {
    endpoint,
    clientIP
  });

  // API key is valid, proceed
  next();
};
