# Locations API Documentation

Complete API documentation for location management in CaravaGo.

## Base URL
```
http://localhost:4000/api/locations
```

## Endpoints

### 1. Get Location by ID
**GET** `/api/locations/:id`

Get a single location by its MongoDB ObjectId.

**Response:**
```json
{
  "success": true,
  "location": {
    "id": "507f1f77bcf86cd799439011",
    "_id": "507f1f77bcf86cd799439011",
    "city": "Rabat",
    "region": "Rabat-Salé-Kénitra",
    "country": "Morocco",
    "country_code": "MAR",
    "latitude": 34.020882,
    "longitude": -6.841650,
    "timezone": "Africa/Casablanca",
    "is_popular": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get Many Locations
**GET** `/api/locations`

Get multiple locations with optional filtering and pagination.

**Query Parameters:**
- `country` - Filter by country name (case-insensitive)
- `region` - Filter by region name (case-insensitive)
- `popular` - Filter by popularity (`true` or `false`)
- `search` - Search in city, country, or region
- `limit` - Number of results (default: 50, max: 100)
- `offset` - Pagination offset (default: 0)
- `sort` - Sort order as JSON string (default: `{"createdAt": -1}`)

**Examples:**
```bash
# Get all locations
GET /api/locations

# Get popular locations only
GET /api/locations?popular=true

# Search for cities containing "rabat"
GET /api/locations?search=rabat

# Get Moroccan cities with pagination
GET /api/locations?country=morocco&limit=10&offset=0

# Sort by city name
GET /api/locations?sort={"city": 1}
```

**Response:**
```json
{
  "success": true,
  "locations": [...],
  "total": 42,
  "limit": 50,
  "offset": 0,
  "hasMore": false
}
```

### 3. Get Popular Locations
**GET** `/api/locations/popular`

Get all locations marked as popular.

**Query Parameters:**
- `limit` - Number of results (default: 20)

**Example:**
```bash
GET /api/locations/popular?limit=10
```

### 4. Get Locations by Country
**GET** `/api/locations/country/:country`

Get all locations in a specific country.

**Query Parameters:**
- `limit` - Number of results (default: 50)
- `sort` - Sort order as JSON string (default: `{"city": 1}`)

**Example:**
```bash
GET /api/locations/country/morocco
GET /api/locations/country/morocco?sort={"city": 1}
```

### 5. Get Locations by Region
**GET** `/api/locations/region/:region`

Get all locations in a specific region.

**Example:**
```bash
GET /api/locations/region/Rabat-Salé-Kénitra
```

### 6. Search Locations (Autocomplete)
**GET** `/api/locations/search`

Search locations for autocomplete functionality.

**Query Parameters:**
- `q` - Search query (required)
- `limit` - Number of results (default: 10)

**Example:**
```bash
GET /api/locations/search?q=rabat&limit=5
```

### 7. Create Location (Admin)
**POST** `/api/locations`

Create a new location.

**Request Body:**
```json
{
  "city": "New City",
  "region": "Region Name",
  "country": "Country Name",
  "country_code": "ABC",
  "latitude": 12.345678,
  "longitude": -98.765432,
  "timezone": "Africa/Casablanca",
  "is_popular": false
}
```

### 8. Update Location (Admin)
**PUT** `/api/locations/:id`

Update an existing location.

**Request Body:** (same as create, all fields optional)

### 9. Delete Location (Admin)
**DELETE** `/api/locations/:id`

Delete a location by ID.

### 10. Bulk Insert Locations (Admin)
**POST** `/api/locations/bulk`

Insert multiple locations at once.

**Request Body:**
```json
{
  "locations": [
    {
      "city": "City 1",
      "country": "Country",
      // ... other fields
    },
    {
      "city": "City 2",
      "country": "Country",
      // ... other fields
    }
  ]
}
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": "...",
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (missing required fields)
- `404` - Not Found
- `409` - Conflict (duplicate city-country)
- `500` - Internal Server Error

## Data Schema

```javascript
{
  city: String (required),
  region: String,
  country: String (required),
  country_code: String (max 3 chars),
  latitude: Number (-90 to 90),
  longitude: Number (-180 to 180),
  timezone: String,
  is_popular: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

- `{city: 1, country: 1}` - Unique compound index
- `{country: 1}` - Country filter index
- `{region: 1}` - Region filter index
- `{is_popular: 1}` - Popular locations index
- `{latitude: 1, longitude: 1}` - Geospatial index

## Usage Examples

### Frontend Integration

```javascript
// Get all Moroccan cities
const response = await fetch('/api/locations?country=morocco');
const data = await response.json();

// Search for cities
const searchResponse = await fetch('/api/locations/search?q=casa');
const searchData = await searchResponse.json();

// Get popular locations for dropdown
const popularResponse = await fetch('/api/locations/popular?limit=10');
const popularData = await popularResponse.json();
```

### React Hook Example

```javascript
const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLocations = async (filters = {}) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/locations?${queryString}`);
      const data = await response.json();
      setLocations(data.locations);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    } finally {
      setLoading(false);
    }
  };

  return { locations, loading, fetchLocations };
};
```