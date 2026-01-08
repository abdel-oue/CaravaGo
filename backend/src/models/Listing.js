import { supabase } from '../config/db.js';
import { dbLogger } from '../utils/logger.js';

class ListingService {
  // Create a new listing
  static async createListing(listingData) {
    try {
      const {
        owner_id,
        title,
        description,
        vehicle_type_id,
        make,
        model,
        year,
        sleeps,
        length_meters,
        location_city,
        location_country,
        latitude,
        longitude,
        daily_rate,
        currency = 'EUR',
        min_rental_days = 1,
        max_rental_days = 90,
        status = 'pending',
        is_featured = false,
        amenity_ids = [],
        photos = []
      } = listingData;

      dbLogger.info('Creating new listing', { owner_id, title });

      // Insert listing into Supabase
      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            owner_id,
            title,
            description,
            vehicle_type_id,
            make,
            model,
            year,
            sleeps,
            length_meters,
            location_city,
            location_country,
            latitude,
            longitude,
            daily_rate,
            currency,
            min_rental_days,
            max_rental_days,
            status,
            is_featured
          }
        ])
        .select()
        .single();

      if (error) {
        dbLogger.error('Failed to create listing', { owner_id, title }, error);
        throw error;
      }

      const listingId = data.id;

      // Add amenities if provided
      if (amenity_ids && amenity_ids.length > 0) {
        await this.addAmenitiesToListing(listingId, amenity_ids);
      }

      // Add photos if provided
      if (photos && photos.length > 0) {
        await this.addPhotosToListing(listingId, photos);
      }

      // Fetch the complete listing with relations
      const completeListing = await this.getListingById(listingId);

      dbLogger.success('Listing created successfully', {
        listing_id: listingId,
        owner_id: data.owner_id,
        title: data.title
      });

      return completeListing;
    } catch (error) {
      dbLogger.error('Listing creation failed', { owner_id: listingData?.owner_id }, error);
      throw error;
    }
  }

  // Add amenities to a listing
  static async addAmenitiesToListing(listingId, amenityIds) {
    try {
      if (!amenityIds || amenityIds.length === 0) return;

      const amenityRecords = amenityIds.map(amenityId => ({
        listing_id: listingId,
        amenity_id: amenityId
      }));

      const { error } = await supabase
        .from('listing_amenities')
        .insert(amenityRecords);

      if (error) {
        dbLogger.error('Failed to add amenities to listing', { listing_id: listingId }, error);
        throw error;
      }

      dbLogger.success('Amenities added to listing', {
        listing_id: listingId,
        count: amenityIds.length
      });
    } catch (error) {
      dbLogger.error('Failed to add amenities', { listing_id: listingId }, error);
      throw error;
    }
  }

  // Add photos to a listing
  static async addPhotosToListing(listingId, photos) {
    try {
      if (!photos || photos.length === 0) return;

      const photoRecords = photos.map((photo, index) => ({
        listing_id: listingId,
        photo_url: photo.url || photo,
        alt_text: photo.alt_text || photo.alt || `Listing photo ${index + 1}`,
        is_primary: photo.is_primary || index === 0,
        sort_order: photo.sort_order || index
      }));

      const { error } = await supabase
        .from('listing_photos')
        .insert(photoRecords);

      if (error) {
        dbLogger.error('Failed to add photos to listing', { listing_id: listingId }, error);
        throw error;
      }

      dbLogger.success('Photos added to listing', {
        listing_id: listingId,
        count: photos.length
      });
    } catch (error) {
      dbLogger.error('Failed to add photos', { listing_id: listingId }, error);
      throw error;
    }
  }

  // Get all listings with optional filters
  static async getAllListings(filters = {}) {
    try {
      const { status, vehicle_type_id, location_city, location_country, limit = 50, offset = 0 } = filters;

      dbLogger.info('Fetching listings', { filters });

      let query = supabase
        .from('listings')
        .select(`
          *,
          vehicle_types:vehicle_type_id(name),
          listing_amenities(amenity_id, amenities:amenity_id(name, category, icon_url)),
          listing_photos(photo_url, alt_text, is_primary, sort_order)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      } else {
        // Default to active listings for public access
        query = query.eq('status', 'active');
      }

      if (vehicle_type_id) {
        query = query.eq('vehicle_type_id', vehicle_type_id);
      }

      if (location_city) {
        query = query.ilike('location_city', `%${location_city}%`);
      }

      if (location_country) {
        query = query.ilike('location_country', `%${location_country}%`);
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

  // Get listing by ID with relations
  static async getListingById(id) {
    try {
      dbLogger.info('Fetching listing by ID', { listing_id: id });

      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          vehicle_types:vehicle_type_id(name, description, icon_url),
          listing_amenities(amenity_id, amenities:amenity_id(id, name, category, icon_url)),
          listing_photos(id, photo_url, alt_text, is_primary, sort_order)
        `)
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

  // Get listings by owner ID
  static async getListingsByOwnerId(ownerId) {
    try {
      dbLogger.info('Fetching listings by owner ID', { owner_id: ownerId });

      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          vehicle_types:vehicle_type_id(name),
          listing_amenities(amenity_id, amenities:amenity_id(name, category, icon_url)),
          listing_photos(photo_url, alt_text, is_primary, sort_order)
        `)
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) {
        dbLogger.error('Failed to fetch owner listings', { owner_id: ownerId }, error);
        throw error;
      }

      dbLogger.success('Owner listings fetched successfully', {
        owner_id: ownerId,
        count: data?.length || 0
      });

      return data || [];
    } catch (error) {
      dbLogger.error('Failed to fetch owner listings', { owner_id: ownerId }, error);
      throw error;
    }
  }

  // Update listing
  static async updateListing(id, ownerId, updateData) {
    try {
      dbLogger.info('Updating listing', { listing_id: id, owner_id: ownerId });

      // First verify the listing belongs to the owner
      const existingListing = await this.getListingById(id);
      if (!existingListing) {
        throw new Error('Listing not found');
      }

      if (existingListing.owner_id !== ownerId) {
        dbLogger.warning('Unauthorized listing update attempt', {
          listing_id: id,
          owner_id: existingListing.owner_id,
          requester_id: ownerId
        });
        throw new Error('Not authorized to update this listing');
      }

      // Separate amenities and photos from other update data
      const { amenity_ids, photos, ...listingUpdateData } = updateData;

      // Prepare update data (remove undefined values)
      const updatePayload = Object.fromEntries(
        Object.entries(listingUpdateData).filter(([_, v]) => v !== undefined)
      );

      // Update listing if there's data to update
      if (Object.keys(updatePayload).length > 0) {
        const { data, error } = await supabase
          .from('listings')
          .update(updatePayload)
          .eq('id', id)
          .eq('owner_id', ownerId)
          .select()
          .single();

        if (error) {
          dbLogger.error('Failed to update listing', { listing_id: id, owner_id: ownerId }, error);
          throw error;
        }
      }

      // Update amenities if provided
      if (amenity_ids !== undefined) {
        // Delete existing amenities
        await supabase
          .from('listing_amenities')
          .delete()
          .eq('listing_id', id);

        // Add new amenities
        if (Array.isArray(amenity_ids) && amenity_ids.length > 0) {
          await this.addAmenitiesToListing(id, amenity_ids);
        }
      }

      // Update photos if provided
      if (photos !== undefined) {
        // Delete existing photos
        await supabase
          .from('listing_photos')
          .delete()
          .eq('listing_id', id);

        // Add new photos
        if (Array.isArray(photos) && photos.length > 0) {
          await this.addPhotosToListing(id, photos);
        }
      }

      // Fetch the updated listing with relations
      const updatedListing = await this.getListingById(id);

      dbLogger.success('Listing updated successfully', {
        listing_id: updatedListing.id,
        title: updatedListing.title
      });

      return updatedListing;
    } catch (error) {
      dbLogger.error('Listing update failed', { listing_id: id, owner_id: ownerId }, error);
      throw error;
    }
  }

  // Delete listing
  static async deleteListing(id, ownerId) {
    try {
      dbLogger.info('Deleting listing', { listing_id: id, owner_id: ownerId });

      // First verify the listing belongs to the owner
      const existingListing = await this.getListingById(id);
      if (!existingListing) {
        throw new Error('Listing not found');
      }

      if (existingListing.owner_id !== ownerId) {
        dbLogger.warning('Unauthorized listing deletion attempt', {
          listing_id: id,
          owner_id: existingListing.owner_id,
          requester_id: ownerId
        });
        throw new Error('Not authorized to delete this listing');
      }

      // Note: Due to CASCADE constraints, related records in listing_amenities and listing_photos
      // will be automatically deleted
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)
        .eq('owner_id', ownerId);

      if (error) {
        dbLogger.error('Failed to delete listing', { listing_id: id, owner_id: ownerId }, error);
        throw error;
      }

      dbLogger.success('Listing deleted successfully', {
        listing_id: id,
        owner_id: ownerId
      });

      return true;
    } catch (error) {
      dbLogger.error('Listing deletion failed', { listing_id: id, owner_id: ownerId }, error);
      throw error;
    }
  }

  // Get all vehicle types
  static async getVehicleTypes() {
    try {
      dbLogger.info('Fetching vehicle types');

      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .order('name');

      if (error) {
        dbLogger.error('Failed to fetch vehicle types', null, error);
        throw error;
      }

      dbLogger.success('Vehicle types fetched successfully', {
        count: data?.length || 0
      });

      return data || [];
    } catch (error) {
      dbLogger.error('Failed to fetch vehicle types', null, error);
      throw error;
    }
  }

  // Get all amenities
  static async getAmenities() {
    try {
      dbLogger.info('Fetching amenities');

      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        dbLogger.error('Failed to fetch amenities', null, error);
        throw error;
      }

      dbLogger.success('Amenities fetched successfully', {
        count: data?.length || 0
      });

      return data || [];
    } catch (error) {
      dbLogger.error('Failed to fetch amenities', null, error);
      throw error;
    }
  }
}

export default ListingService;
