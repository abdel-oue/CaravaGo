import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Component to handle map instance
const MapInstance = ({ setMapInstance }) => {
    const map = useMap();
    useEffect(() => {
        if (setMapInstance) {
            setMapInstance(map);
        }
    }, [map, setMapInstance]);
    return null;
};

const Map = ({ vehicles = [] }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [mapError, setMapError] = useState(null);
    const mapInstanceRef = useRef(null);
    const initializationRef = useRef(false);
    const center = useMemo(() => [50.8229, -0.1363], []);

    useEffect(() => {
        // Prevent double initialization in StrictMode
        if (initializationRef.current) return;
        initializationRef.current = true;

        let mounted = true;
        
        const initMap = async () => {
            try {
                // Fix leaflet icon paths for Vite - this must happen after mount
                if (L.Icon.Default.prototype._getIconUrl) {
                    delete L.Icon.Default.prototype._getIconUrl;
                }
                
                L.Icon.Default.mergeOptions({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowSize: [41, 41]
                });

                // Small delay to ensure DOM is fully ready
                await new Promise(resolve => setTimeout(resolve, 150));
                
                if (mounted && !mapError) {
                    setIsMounted(true);
                }
            } catch (error) {
                console.error('Map initialization error:', error);
                if (mounted) {
                    setMapError(error.message || 'Failed to initialize map');
                    setIsMounted(false);
                }
            }
        };

        initMap();

        return () => {
            mounted = false;
            // Don't reset initializationRef on cleanup to prevent re-init
        };
    }, [mapError]);

    if (mapError) {
        return (
            <div className="h-full w-full relative bg-gray-100 flex items-center justify-center">
                <div className="text-red-500 text-center p-4">
                    <p className="font-semibold">Map failed to load</p>
                    <p className="text-sm mt-2">{mapError}</p>
                </div>
            </div>
        );
    }

    if (!isMounted) {
        return (
            <div className="h-full w-full relative bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500">Loading map...</div>
            </div>
        );
    }

    // Memoize markers to prevent unnecessary re-renders
    const markers = useMemo(() => {
        if (!vehicles || !Array.isArray(vehicles)) return [];
        
        return vehicles.map(vehicle => {
            if (!vehicle || !vehicle.coordinates) return null;
            
            const priceIcon = L.divIcon({
                className: 'custom-price-marker',
                html: `<div class="bg-white text-gray-900 font-bold px-2 py-1 rounded-md shadow-md border border-gray-200 text-sm">€${vehicle.pricePerDay || 0}</div>`,
                iconSize: [60, 30],
                iconAnchor: [30, 15]
            });

            return (
                <Marker key={vehicle.id} position={vehicle.coordinates} icon={priceIcon}>
                    <Popup>
                        <div>
                            <h3 className="font-bold">{vehicle.type || 'Vehicle'}</h3>
                            <p>{vehicle.location || 'Unknown'}</p>
                            <div>€{vehicle.pricePerDay || 0}/day</div>
                        </div>
                    </Popup>
                </Marker>
            );
        }).filter(Boolean);
    }, [vehicles]);

    try {
        return (
            <div className="h-full w-full relative">
                <MapContainer 
                    center={center} 
                    zoom={11} 
                    scrollWheelZoom={true} 
                    className="h-full w-full z-0"
                    style={{ height: '100%', width: '100%' }}
                    key="map-container"
                >
                    <MapInstance setMapInstance={(map) => { mapInstanceRef.current = map; }} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markers}
                </MapContainer>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
                    <button className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-main hover:bg-gray-50 transition-colors pointer-events-auto">
                        Search in this area
                    </button>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Map render error:', error);
        return (
            <div className="h-full w-full relative bg-gray-100 flex items-center justify-center">
                <div className="text-red-500 text-center p-4">
                    <p className="font-semibold">Error rendering map</p>
                    <p className="text-sm mt-2">{error.message}</p>
                </div>
            </div>
        );
    }
};

export default Map;
