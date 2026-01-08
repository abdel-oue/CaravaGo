import express from 'express';
import {
  getLocationById,
  getLocations,
  getPopularLocations,
  getLocationsByCountry,
  getLocationsByRegion,
  searchLocations
} from '../controllers/location.controller.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getLocations);
router.get('/popular', getPopularLocations);
router.get('/country/:country', getLocationsByCountry);
router.get('/region/:region', getLocationsByRegion);
router.get('/search', searchLocations);
router.get('/:id', getLocationById);

export default router;