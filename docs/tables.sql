-- CaravaGo Database Schema
-- PostgreSQL compatible (for Supabase)

-- ===========================================
-- USERS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_owner BOOLEAN DEFAULT FALSE,
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- VEHICLE TYPES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS vehicle_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- Campervan, Motorhome, RV, Caravan, etc.
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- LISTINGS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    vehicle_type_id INTEGER REFERENCES vehicle_types(id),
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    sleeps INTEGER CHECK (sleeps > 0),
    length_meters DECIMAL(4,2), -- Length in meters
    location_city VARCHAR(100) NOT NULL,
    location_country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    daily_rate DECIMAL(10,2) NOT NULL CHECK (daily_rate > 0),
    currency VARCHAR(3) DEFAULT 'EUR',
    min_rental_days INTEGER DEFAULT 1 CHECK (min_rental_days > 0),
    max_rental_days INTEGER DEFAULT 90,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'active', 'inactive', 'suspended')),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- VEHICLE AMENITIES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon_url TEXT,
    category VARCHAR(50), -- kitchen, bathroom, entertainment, safety, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default amenities
INSERT INTO amenities (name, category) VALUES
('Kitchen', 'kitchen'),
('Bathroom', 'bathroom'),
('Air Conditioning', 'comfort'),
('Heating', 'comfort'),
('WiFi', 'technology'),
('TV', 'entertainment'),
('Fridge', 'kitchen'),
('Microwave', 'kitchen'),
('Awning', 'exterior'),
('Bike Rack', 'exterior'),
('Solar Panels', 'technology'),
('Generator', 'technology'),
('Pet Friendly', 'other'),
('Smoking Allowed', 'other')
ON CONFLICT (name) DO NOTHING;

-- ===========================================
-- LISTING AMENITIES JUNCTION TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS listing_amenities (
    listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
    amenity_id INTEGER REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, amenity_id)
);

-- ===========================================
-- LISTING PHOTOS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS listing_photos (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- BOOKINGS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    renter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'refunded')),
    special_requests TEXT,
    cancellation_reason TEXT,
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_dates CHECK (end_date > start_date),
    CONSTRAINT valid_price CHECK (total_price > 0)
);

-- ===========================================
-- REVIEWS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- MESSAGES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- FAVORITES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS favorites (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, listing_id)
);

-- ===========================================
-- LOCATIONS TABLE (for search/filtering)
-- ===========================================
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(3),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    timezone VARCHAR(50),
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(city, country)
);

-- ===========================================
-- PROMOTIONS/DISCOUNTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    max_discount DECIMAL(10,2),
    min_booking_days INTEGER DEFAULT 1,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_to_all BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- BOOKING PROMOTIONS JUNCTION TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS booking_promotions (
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    promotion_id INTEGER REFERENCES promotions(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (booking_id, promotion_id)
);

-- ===========================================
-- NOTIFICATIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- booking_request, booking_confirmed, review_received, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional structured data
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Listings table indexes
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_vehicle_type ON listings(vehicle_type_id);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location_city, location_country);
CREATE INDEX IF NOT EXISTS idx_listings_daily_rate ON listings(daily_rate);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);
CREATE INDEX IF NOT EXISTS idx_listings_lat_lng ON listings(latitude, longitude);

-- Bookings table indexes
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Reviews table indexes
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Locations table indexes
CREATE INDEX IF NOT EXISTS idx_locations_country_city ON locations(country, city);
CREATE INDEX IF NOT EXISTS idx_locations_popular ON locations(is_popular);
CREATE INDEX IF NOT EXISTS idx_locations_lat_lng ON locations(latitude, longitude);

-- ===========================================
-- TRIGGERS FOR UPDATED_AT
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- RLS (Row Level Security) POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_own_data ON users FOR ALL USING (auth.uid() = id);

-- Listings policies
CREATE POLICY listings_owner_access ON listings FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY listings_public_read ON listings FOR SELECT USING (status = 'active');

-- Bookings policies
CREATE POLICY bookings_owner_access ON bookings FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY bookings_renter_access ON bookings FOR ALL USING (auth.uid() = renter_id);

-- Reviews policies
CREATE POLICY reviews_owner_access ON reviews FOR ALL USING (auth.uid() = reviewee_id);
CREATE POLICY reviews_public_read ON reviews FOR SELECT USING (true);

-- Messages policies
CREATE POLICY messages_sender_access ON messages FOR ALL USING (auth.uid() = sender_id);
CREATE POLICY messages_receiver_access ON messages FOR ALL USING (auth.uid() = receiver_id);

-- Favorites policies
CREATE POLICY favorites_user_access ON favorites FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY notifications_user_access ON notifications FOR ALL USING (auth.uid() = user_id);

-- ===========================================
-- SAMPLE DATA (Optional)
-- ===========================================

-- Insert sample vehicle types
INSERT INTO vehicle_types (name, description) VALUES
('Campervan', 'Compact and maneuverable campervans perfect for city exploration'),
('Motorhome', 'Full-featured motorhomes with all the comforts of home'),
('RV', 'Recreational vehicles offering luxury camping experiences'),
('Caravan', 'Towable caravans for those who prefer driving their own vehicle'),
('Other', 'Other types of camping vehicles')
ON CONFLICT (name) DO NOTHING;

-- Insert sample popular locations
INSERT INTO locations (city, region, country, country_code, is_popular) VALUES
('Barcelona', 'Catalonia', 'Spain', 'ESP', true),
('Amsterdam', 'North Holland', 'Netherlands', 'NLD', true),
('Berlin', 'Berlin', 'Germany', 'DEU', true),
('Paris', 'Île-de-France', 'France', 'FRA', true),
('Rome', 'Lazio', 'Italy', 'ITA', true),
('Lisbon', 'Lisbon', 'Portugal', 'PRT', true),
('Vienna', 'Vienna', 'Austria', 'AUT', true),
('Prague', 'Prague', 'Czech Republic', 'CZE', true),
('Budapest', 'Budapest', 'Hungary', 'HUN', true),
('Athens', 'Attica', 'Greece', 'GRC', true)
ON CONFLICT (city, country) DO NOTHING;
