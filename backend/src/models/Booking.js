import mongoose from 'mongoose';
import { dbLogger } from '../utils/logger.js';

// Booking Schema
const bookingSchema = new mongoose.Schema({
  listing_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  renter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.start_date;
      },
      message: 'End date must be after start date'
    }
  },
  total_days: {
    type: Number,
    required: true,
    min: 1
  },
  total_price: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    default: 'EUR',
    maxlength: 3
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending'
  },
  special_requests: {
    type: String,
    default: null
  },
  cancellation_reason: {
    type: String,
    default: null
  },
  stripe_payment_intent_id: {
    type: String,
    default: null,
    maxlength: 255
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for performance
bookingSchema.index({ listing_id: 1 });
bookingSchema.index({ renter_id: 1 });
bookingSchema.index({ owner_id: 1 });
bookingSchema.index({ start_date: 1, end_date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ created_at: -1 });

// Virtual for id to return _id as id for frontend compatibility
bookingSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Booking Promotion Schema (junction table)
const bookingPromotionSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  promotion_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion',
    required: true
  },
  discount_amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Unique compound index for booking-promotion relationship
bookingPromotionSchema.index({ booking_id: 1, promotion_id: 1 }, { unique: true });

// Create models
const Booking = mongoose.model('bookings', bookingSchema);
const BookingPromotion = mongoose.model('bookingpromotions', bookingPromotionSchema);

class BookingService {
  // Create a new booking
  static async createBooking(bookingData) {
    try {
      const {
        listing_id,
        renter_id,
        owner_id,
        start_date,
        end_date,
        total_days,
        total_price,
        currency = 'EUR',
        status = 'pending',
        special_requests,
        stripe_payment_intent_id
      } = bookingData;

      dbLogger.info('Creating new booking', { listing_id, renter_id, start_date });

      // Calculate total days if not provided
      const calculatedTotalDays = total_days || Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));

      // Create booking
      const booking = new Booking({
        listing_id,
        renter_id,
        owner_id,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        total_days: calculatedTotalDays,
        total_price,
        currency,
        status,
        special_requests,
        stripe_payment_intent_id
      });

      const savedBooking = await booking.save();

      // Populate relations for response
      const completeBooking = await Booking.findById(savedBooking._id)
        .populate('listing_id', 'title location_city location_country daily_rate')
        .populate('renter_id', 'name email')
        .populate('owner_id', 'name email')
        .lean();

      dbLogger.success('Booking created successfully', {
        booking_id: savedBooking._id.toString(),
        listing_id: listing_id.toString(),
        renter_id: renter_id.toString()
      });

      // Convert to JSON format with id
      return {
        ...completeBooking,
        id: completeBooking._id.toString(),
        listing_id: completeBooking.listing_id?._id?.toString() || completeBooking.listing_id,
        renter_id: completeBooking.renter_id?._id?.toString() || completeBooking.renter_id,
        owner_id: completeBooking.owner_id?._id?.toString() || completeBooking.owner_id
      };
    } catch (error) {
      dbLogger.error('Booking creation failed', { listing_id: bookingData?.listing_id }, error);
      throw error;
    }
  }

  // Get all bookings with optional filters
  static async getAllBookings(filters = {}) {
    try {
      const { status, renter_id, owner_id, listing_id, limit = 50, offset = 0 } = filters;

      dbLogger.info('Fetching bookings', { filters });

      let query = Booking.find();

      // Apply filters
      if (status) {
        query = query.where('status').equals(status);
      }

      if (renter_id) {
        query = query.where('renter_id').equals(renter_id);
      }

      if (owner_id) {
        query = query.where('owner_id').equals(owner_id);
      }

      if (listing_id) {
        query = query.where('listing_id').equals(listing_id);
      }

      // Populate relations
      query = query
        .populate('listing_id', 'title location_city location_country daily_rate')
        .populate('renter_id', 'name email')
        .populate('owner_id', 'name email')
        .sort({ created_at: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .lean();

      const data = await query;

      dbLogger.success('Bookings fetched successfully', {
        count: data?.length || 0,
        filters
      });

      // Transform to include id field
      return data.map(booking => ({
        ...booking,
        id: booking._id.toString(),
        listing_id: booking.listing_id?._id?.toString() || booking.listing_id,
        renter_id: booking.renter_id?._id?.toString() || booking.renter_id,
        owner_id: booking.owner_id?._id?.toString() || booking.owner_id
      }));
    } catch (error) {
      dbLogger.error('Failed to fetch bookings', { filters }, error);
      throw error;
    }
  }

  // Get booking by ID with relations
  static async getBookingById(id) {
    try {
      dbLogger.info('Fetching booking by ID', { booking_id: id });

      const booking = await Booking.findById(id)
        .populate('listing_id', 'title location_city location_country daily_rate photos')
        .populate('renter_id', 'name email phone avatar_url')
        .populate('owner_id', 'name email phone avatar_url')
        .lean();

      if (!booking) {
        dbLogger.warning('Booking not found', { booking_id: id });
        return null;
      }

      dbLogger.success('Booking fetched successfully', {
        booking_id: booking._id.toString(),
        status: booking.status
      });

      // Transform to include id field
      return {
        ...booking,
        id: booking._id.toString(),
        listing_id: booking.listing_id?._id?.toString() || booking.listing_id,
        renter_id: booking.renter_id?._id?.toString() || booking.renter_id,
        owner_id: booking.owner_id?._id?.toString() || booking.owner_id
      };
    } catch (error) {
      dbLogger.error('Failed to fetch booking', { booking_id: id }, error);
      throw error;
    }
  }

  // Get bookings by renter ID
  static async getBookingsByRenterId(renterId) {
    try {
      dbLogger.info('Fetching bookings by renter ID', { renter_id: renterId });

      // Convert renterId to ObjectId if it's a string
      const renterObjectId = typeof renterId === 'string'
        ? new mongoose.Types.ObjectId(renterId)
        : renterId;

      const bookings = await Booking.find({ renter_id: renterObjectId })
        .populate('listing_id', 'title location_city location_country daily_rate photos')
        .populate('owner_id', 'name email phone avatar_url')
        .sort({ created_at: -1 })
        .lean();

      dbLogger.success('Renter bookings fetched successfully', {
        renter_id: renterId,
        count: bookings?.length || 0
      });

      // Transform to include id field
      return bookings.map(booking => ({
        ...booking,
        id: booking._id.toString(),
        listing_id: booking.listing_id?._id?.toString() || booking.listing_id,
        renter_id: booking.renter_id?._id?.toString() || booking.renter_id,
        owner_id: booking.owner_id?._id?.toString() || booking.owner_id
      }));
    } catch (error) {
      dbLogger.error('Failed to fetch renter bookings', { renter_id: renterId }, error);
      throw error;
    }
  }

  // Get bookings by owner ID
  static async getBookingsByOwnerId(ownerId) {
    try {
      dbLogger.info('Fetching bookings by owner ID', { owner_id: ownerId });

      // Convert ownerId to ObjectId if it's a string
      const ownerObjectId = typeof ownerId === 'string'
        ? new mongoose.Types.ObjectId(ownerId)
        : ownerId;

      const bookings = await Booking.find({ owner_id: ownerObjectId })
        .populate('listing_id', 'title location_city location_country daily_rate photos')
        .populate('renter_id', 'name email phone avatar_url')
        .sort({ created_at: -1 })
        .lean();

      dbLogger.success('Owner bookings fetched successfully', {
        owner_id: ownerId,
        count: bookings?.length || 0
      });

      // Transform to include id field
      return bookings.map(booking => ({
        ...booking,
        id: booking._id.toString(),
        listing_id: booking.listing_id?._id?.toString() || booking.listing_id,
        renter_id: booking.renter_id?._id?.toString() || booking.renter_id,
        owner_id: booking.owner_id?._id?.toString() || booking.owner_id
      }));
    } catch (error) {
      dbLogger.error('Failed to fetch owner bookings', { owner_id: ownerId }, error);
      throw error;
    }
  }

  // Get bookings by listing ID
  static async getBookingsByListingId(listingId) {
    try {
      dbLogger.info('Fetching bookings by listing ID', { listing_id: listingId });

      // Convert listingId to ObjectId if it's a string
      const listingObjectId = typeof listingId === 'string'
        ? new mongoose.Types.ObjectId(listingId)
        : listingId;

      const bookings = await Booking.find({ listing_id: listingObjectId })
        .populate('renter_id', 'name email phone avatar_url')
        .populate('owner_id', 'name email phone avatar_url')
        .sort({ start_date: 1 })
        .lean();

      dbLogger.success('Listing bookings fetched successfully', {
        listing_id: listingId,
        count: bookings?.length || 0
      });

      // Transform to include id field
      return bookings.map(booking => ({
        ...booking,
        id: booking._id.toString(),
        listing_id: booking.listing_id?._id?.toString() || booking.listing_id,
        renter_id: booking.renter_id?._id?.toString() || booking.renter_id,
        owner_id: booking.owner_id?._id?.toString() || booking.owner_id
      }));
    } catch (error) {
      dbLogger.error('Failed to fetch listing bookings', { listing_id: listingId }, error);
      throw error;
    }
  }

  // Update booking
  static async updateBooking(id, updaterId, updateData) {
    try {
      dbLogger.info('Updating booking', { booking_id: id, updater_id: updaterId });

      // Convert updaterId to ObjectId if it's a string
      const updaterObjectId = typeof updaterId === 'string'
        ? new mongoose.Types.ObjectId(updaterId)
        : updaterId;

      // First verify the booking exists and user has permission
      const existingBooking = await Booking.findById(id)
        .populate('renter_id', 'name')
        .populate('owner_id', 'name');

      if (!existingBooking) {
        throw new Error('Booking not found');
      }

      // Only renter or owner can update the booking
      if (existingBooking.renter_id.toString() !== updaterObjectId.toString() &&
          existingBooking.owner_id.toString() !== updaterObjectId.toString()) {
        dbLogger.warning('Unauthorized booking update attempt', {
          booking_id: id,
          updater_id: updaterId,
          renter_id: existingBooking.renter_id.toString(),
          owner_id: existingBooking.owner_id.toString()
        });
        throw new Error('Not authorized to update this booking');
      }

      // Prepare update data (remove undefined values)
      const updatePayload = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      // Update booking
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { $set: updatePayload },
        { new: true, runValidators: true }
      )
        .populate('listing_id', 'title location_city location_country daily_rate')
        .populate('renter_id', 'name email phone avatar_url')
        .populate('owner_id', 'name email phone avatar_url')
        .lean();

      if (!updatedBooking) {
        throw new Error('Booking not found');
      }

      dbLogger.success('Booking updated successfully', {
        booking_id: updatedBooking._id.toString(),
        status: updatedBooking.status
      });

      // Transform to include id field
      return {
        ...updatedBooking,
        id: updatedBooking._id.toString(),
        listing_id: updatedBooking.listing_id?._id?.toString() || updatedBooking.listing_id,
        renter_id: updatedBooking.renter_id?._id?.toString() || updatedBooking.renter_id,
        owner_id: updatedBooking.owner_id?._id?.toString() || updatedBooking.owner_id
      };
    } catch (error) {
      dbLogger.error('Booking update failed', { booking_id: id, updater_id: updaterId }, error);
      throw error;
    }
  }

  // Delete booking
  static async deleteBooking(id, deleterId) {
    try {
      dbLogger.info('Deleting booking', { booking_id: id, deleter_id: deleterId });

      // Convert deleterId to ObjectId if it's a string
      const deleterObjectId = typeof deleterId === 'string'
        ? new mongoose.Types.ObjectId(deleterId)
        : deleterId;

      // First verify the booking exists and user has permission
      const existingBooking = await Booking.findById(id)
        .populate('renter_id', 'name')
        .populate('owner_id', 'name');

      if (!existingBooking) {
        throw new Error('Booking not found');
      }

      // Only renter or owner can delete the booking (typically only before confirmation)
      if (existingBooking.renter_id.toString() !== deleterObjectId.toString() &&
          existingBooking.owner_id.toString() !== deleterObjectId.toString()) {
        dbLogger.warning('Unauthorized booking deletion attempt', {
          booking_id: id,
          deleter_id: deleterId,
          renter_id: existingBooking.renter_id.toString(),
          owner_id: existingBooking.owner_id.toString()
        });
        throw new Error('Not authorized to delete this booking');
      }

      // Only allow deletion of pending bookings
      if (existingBooking.status !== 'pending') {
        dbLogger.warning('Cannot delete confirmed booking', {
          booking_id: id,
          status: existingBooking.status
        });
        throw new Error('Cannot delete a booking that is not pending');
      }

      await Booking.findByIdAndDelete(id);

      dbLogger.success('Booking deleted successfully', {
        booking_id: id,
        deleter_id: deleterId
      });

      return true;
    } catch (error) {
      dbLogger.error('Booking deletion failed', { booking_id: id, deleter_id: deleterId }, error);
      throw error;
    }
  }

  // Check availability for a listing and date range
  static async checkAvailability(listingId, startDate, endDate) {
    try {
      dbLogger.info('Checking availability', { listing_id: listingId, start_date: startDate, end_date: endDate });

      // Convert listingId to ObjectId if it's a string
      const listingObjectId = typeof listingId === 'string'
        ? new mongoose.Types.ObjectId(listingId)
        : listingId;

      const start = new Date(startDate);
      const end = new Date(endDate);

      // Find any overlapping bookings that are not cancelled
      const conflictingBookings = await Booking.find({
        listing_id: listingObjectId,
        status: { $in: ['pending', 'confirmed', 'completed'] },
        $or: [
          // New booking starts during existing booking
          { start_date: { $lte: start }, end_date: { $gt: start } },
          // New booking ends during existing booking
          { start_date: { $lt: end }, end_date: { $gte: end } },
          // New booking completely encompasses existing booking
          { start_date: { $gte: start }, end_date: { $lte: end } }
        ]
      });

      const isAvailable = conflictingBookings.length === 0;

      dbLogger.success('Availability checked', {
        listing_id: listingId,
        is_available: isAvailable,
        conflicting_bookings: conflictingBookings.length
      });

      return {
        available: isAvailable,
        conflicting_bookings: conflictingBookings.map(booking => ({
          id: booking._id.toString(),
          start_date: booking.start_date,
          end_date: booking.end_date,
          status: booking.status
        }))
      };
    } catch (error) {
      dbLogger.error('Availability check failed', { listing_id: listingId }, error);
      throw error;
    }
  }
}

export default BookingService;
export { Booking, BookingPromotion };
