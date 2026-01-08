import { supabase } from '../config/db.js';
import { dbLogger } from '../utils/logger.js';

class ListingService {
  // Create a new listing
  static async createListing(listingData) {
    try {
      const {
        user_id,
        title,
        vehicle_type,
        location,
        year,
        description,
        make,
        model,
        sleeps,
        length,
        amenities,
        daily_rate,
        minimum_rental_period,
        images,
        status = 'draft'
      } = listingData;

      dbLogger.info('Creating new listing', { user_id, title });

      // Insert listing into Supabase
      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            user_id,
            title,
            vehicle_type,
            location,
            year,
            description,
            make,
            model,
            sleeps,
            length,
            amenities: amenities || [],
            daily_rate,
            minimum_rental_period,
            images: images || [],
            status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        dbLogger.error('Failed to create listing', { user_id, title }, error);
        throw error;
      }

      dbLogger.success('Listing created successfully', {
        listing_id: data.id,
        user_id: data.user_id,
        title: data.title
      });

      return data;
    } catch (error) {
      dbLogger.error('Listing creation failed', { user_id: listingData?.user_id }, error);
      throw error;
    }
  }

  // Get all listings with optional filters
  static async getAllListings(filters = {}) {
    try {
      const { status, vehicle_type, location, limit = 50, offset = 0 } = filters;

      dbLogger.info('Fetching listings', { filters });

      let query = supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      if (vehicle_type) {
        query = query.eq('vehicle_type', vehicle_type);
      }

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      const { data, error } = await query;

      if (error) {
        dbLogger.error('Failed to fetch listings', { filters }, error);
        throw error;
      }

      dbLogger.success('Listings fetched successfully', {
        count: data?.length || 0,
        filters
      });

      return data || [];
    } catch (error) {
      dbLogger.error('Failed to fetch listings', { filters }, error);
      throw error;
    }
  }

  // Get listing by ID
  static async getListingById(id) {
    try {
      dbLogger.info('Fetching listing by ID', { listing_id: id });

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        dbLogger.error('Failed to fetch listing', { listing_id: id }, error);
        throw error;
      }

      if (!data) {
        dbLogger.warning('Listing not found', { listing_id: id });
        return null;
      }

      dbLogger.success('Listing fetched successfully', {
        listing_id: data.id,
        title: data.title
      });

      return data;
    } catch (error) {
      dbLogger.error('Failed to fetch listing', { listing_id: id }, error);
      throw error;
    }
  }

  // Get listings by user ID
  static async getListingsByUserId(userId) {
    try {
      dbLogger.info('Fetching listings by user ID', { user_id: userId });

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        dbLogger.error('Failed to fetch user listings', { user_id: userId }, error);
        throw error;
      }

      dbLogger.success('User listings fetched successfully', {
        user_id: userId,
        count: data?.length || 0
      });

      return data || [];
    } catch (error) {
      dbLogger.error('Failed to fetch user listings', { user_id: userId }, error);
      throw error;
    }
  }

  // Update listing
  static async updateListing(id, userId, updateData) {
    try {
      dbLogger.info('Updating listing', { listing_id: id, user_id: userId });

      // First verify the listing belongs to the user
      const existingListing = await this.getListingById(id);
      if (!existingListing) {
        throw new Error('Listing not found');
      }

      if (existingListing.user_id !== userId) {
        dbLogger.warning('Unauthorized listing update attempt', {
          listing_id: id,
          owner_id: existingListing.user_id,
          requester_id: userId
        });
        throw new Error('Not authorized to update this listing');
      }

      // Prepare update data
      const updatePayload = {
        ...updateData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('listings')
        .update(updatePayload)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        dbLogger.error('Failed to update listing', { listing_id: id, user_id: userId }, error);
        throw error;
      }

      dbLogger.success('Listing updated successfully', {
        listing_id: data.id,
        title: data.title
      });

      return data;
    } catch (error) {
      dbLogger.error('Listing update failed', { listing_id: id, user_id: userId }, error);
      throw error;
    }
  }

  // Delete listing
  static async deleteListing(id, userId) {
    try {
      dbLogger.info('Deleting listing', { listing_id: id, user_id: userId });

      // First verify the listing belongs to the user
      const existingListing = await this.getListingById(id);
      if (!existingListing) {
        throw new Error('Listing not found');
      }

      if (existingListing.user_id !== userId) {
        dbLogger.warning('Unauthorized listing deletion attempt', {
          listing_id: id,
          owner_id: existingListing.user_id,
          requester_id: userId
        });
        throw new Error('Not authorized to delete this listing');
      }

      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        dbLogger.error('Failed to delete listing', { listing_id: id, user_id: userId }, error);
        throw error;
      }

      dbLogger.success('Listing deleted successfully', {
        listing_id: id,
        user_id: userId
      });

      return true;
    } catch (error) {
      dbLogger.error('Listing deletion failed', { listing_id: id, user_id: userId }, error);
      throw error;
    }
  }
}

export default ListingService;
