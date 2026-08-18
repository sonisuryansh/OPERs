import React, { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'

const LiveTracking = ({ onLocationSelect, activeField = 'pickup', pickup = '', destination = '' }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const destMarkerRef = useRef(null);
    const polylineRef = useRef(null);
    const polylineBorderRef = useRef(null);
    const onLocationSelectRef = useRef(onLocationSelect);

    const [ selectedAddress, setSelectedAddress ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ routeInfo, setRouteInfo ] = useState(null);

    useEffect(() => {
        onLocationSelectRef.current = onLocationSelect;
    }, [ onLocationSelect ]);

    // Custom OPERs pin marker icon (Pickup)
    const pickupMarkerIcon = L.divIcon({
        className: 'custom-pickup-pin',
        html: `
            <div style="
                width: 36px;
                height: 36px;
                background-color: #000000;
                border: 3px solid #10b981;
                border-radius: 50%;
                box-shadow: 0 6px 18px rgba(0,0,0,0.45);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: grab;
                transition: transform 0.2s ease;
            ">
                <div style="width: 10px; height: 10px; background-color: #ffffff; border-radius: 2px;"></div>
            </div>
        `,
        iconSize: [ 36, 36 ],
        iconAnchor: [ 18, 18 ]
    });

    // Custom Destination pin marker icon
    const destMarkerIcon = L.divIcon({
        className: 'custom-dest-pin',
        html: `
            <div style="
                width: 36px;
                height: 36px;
                background-color: #000000;
                border: 3px solid #ef4444;
                border-radius: 50%;
                box-shadow: 0 6px 18px rgba(0,0,0,0.45);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            ">
                <div style="width: 10px; height: 10px; background-color: #ef4444; border-radius: 50%;"></div>
            </div>
        `,
        iconSize: [ 36, 36 ],
        iconAnchor: [ 18, 18 ]
    });

    // Helper for reverse geocoding lat, lng into human readable address
    const updateLocation = async (lat, lng) => {
        setLoading(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
                headers: { 'User-Agent': 'OPERs-Ride-Hailing-App/1.0' }
            });
            const data = await response.json();
            let cleanAddress = '';
            if (data && data.display_name) {
                const parts = data.display_name.split(', ');
                cleanAddress = parts.slice(0, 3).join(', ');
            } else {
                cleanAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            }

            setSelectedAddress(cleanAddress);
            if (onLocationSelectRef.current) {
                onLocationSelectRef.current(cleanAddress, { lat, lng });
            }
        } catch (error) {
            console.error('Reverse geocode error:', error);
            const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setSelectedAddress(fallback);
            if (onLocationSelectRef.current) {
                onLocationSelectRef.current(fallback, { lat, lng });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLocateUser = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (mapInstanceRef.current && markerRef.current) {
                        mapInstanceRef.current.setView([ latitude, longitude ], 15, { animate: true });
                        markerRef.current.setLatLng([ latitude, longitude ]);
                    }
                    updateLocation(latitude, longitude);
                },
                (err) => {
                    console.log('Geolocation error:', err);
                    setLoading(false);
                },
                { enableHighAccuracy: true }
            );
        }
    };

    // Draw route polyline between pickup and destination
    const drawRoute = useCallback(async (origin, dest) => {
        if (!mapInstanceRef.current || !origin || !dest || origin.length < 3 || dest.length < 3) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-route`, {
                params: { origin, destination: dest },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.coordinates?.length > 0) {
                const map = mapInstanceRef.current;
                const coords = response.data.coordinates; // Array of [lat, lng]

                // Remove existing route layers
                if (polylineBorderRef.current) map.removeLayer(polylineBorderRef.current);
                if (polylineRef.current) map.removeLayer(polylineRef.current);
                if (destMarkerRef.current) map.removeLayer(destMarkerRef.current);

                // Origin & Dest coordinates
                const originPt = coords[0];
                const destPt = coords[coords.length - 1];

                // Update pickup marker position
                if (markerRef.current) {
                    markerRef.current.setLatLng(originPt);
                }

                // Add destination marker
                destMarkerRef.current = L.marker(destPt, { icon: destMarkerIcon }).addTo(map);

                // 1. Draw outer black casing border
                polylineBorderRef.current = L.polyline(coords, {
                    color: '#000000',
                    weight: 7,
                    opacity: 0.95,
                    lineCap: 'round',
                    lineJoin: 'round'
                }).addTo(map);

                // 2. Draw inner high-contrast dark road polyline
                polylineRef.current = L.polyline(coords, {
                    color: '#111827',
                    weight: 5,
                    opacity: 1.0,
                    lineCap: 'round',
                    lineJoin: 'round'
                }).addTo(map);

                // Set route metadata
                setRouteInfo({
                    distance: response.data.distance,
                    duration: response.data.duration
                });

                // Auto zoom & fit map bounds with padding
                const bounds = L.latLngBounds(coords);
                map.fitBounds(bounds, {
                    padding: [ 90, 90 ],
                    maxZoom: 16,
                    animate: true
                });
            }
        } catch (error) {
            console.error('Failed to draw route:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to trigger route drawing when pickup and destination change
    useEffect(() => {
        if (pickup && destination && pickup.length >= 3 && destination.length >= 3) {
            drawRoute(pickup, destination);
        } else {
            // Clean up route if inputs are cleared
            if (mapInstanceRef.current) {
                if (polylineBorderRef.current) mapInstanceRef.current.removeLayer(polylineBorderRef.current);
                if (polylineRef.current) mapInstanceRef.current.removeLayer(polylineRef.current);
                if (destMarkerRef.current) mapInstanceRef.current.removeLayer(destMarkerRef.current);
                polylineBorderRef.current = null;
                polylineRef.current = null;
                destMarkerRef.current = null;
                setRouteInfo(null);
            }
        }
    }, [ pickup, destination, drawRoute ]);

    // Initialize Map
    useEffect(() => {
        if (!mapRef.current) return;

        if (!mapInstanceRef.current) {
            const initialLat = 28.6139;
            const initialLng = 77.2090;

            const map = L.map(mapRef.current, {
                center: [ initialLat, initialLng ],
                zoom: 14,
                zoomControl: false
            });

            // CartoDB Voyager clean silver map tiles
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
                maxZoom: 19
            }).addTo(map);

            // Draggable pin marker
            const marker = L.marker([ initialLat, initialLng ], {
                icon: pickupMarkerIcon,
                draggable: true
            }).addTo(map);

            marker.on('dragend', (e) => {
                const position = e.target.getLatLng();
                map.setView([ position.lat, position.lng ], map.getZoom(), { animate: true });
                updateLocation(position.lat, position.lng);
            });

            map.on('click', (e) => {
                const { lat, lng } = e.latlng;
                marker.setLatLng([ lat, lng ]);
                map.setView([ lat, lng ], map.getZoom(), { animate: true });
                updateLocation(lat, lng);
            });

            markerRef.current = marker;
            mapInstanceRef.current = map;

            // Attempt initial geolocation fetch
            handleLocateUser();
        }
    }, []);

    return (
        <div className="w-full h-full relative">
            {/* Map Container */}
            <div ref={mapRef} className="w-full h-full z-0 relative" style={{ minHeight: '100vh', width: '100%' }} />

            {/* Route Summary Pill (when route is calculated) */}
            {routeInfo && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-2xl shadow-2xl text-sm font-semibold border border-white/20 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                        <i className="ri-road-map-line text-base"></i>
                        <span>{routeInfo.distance}</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <div className="flex items-center gap-1.5 text-blue-400">
                        <i className="ri-time-line text-base"></i>
                        <span>{routeInfo.duration}</span>
                    </div>
                </div>
            )}

            {/* Instruction Banner at top center */}
            {!routeInfo && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2 bg-black/80 text-white px-4 py-2 rounded-full shadow-lg text-sm backdrop-blur-md font-medium border border-white/20">
                    <i className="ri-map-pin-2-fill text-yellow-400"></i>
                    <span>
                        {loading ? 'Calculating route...' : `Tap map to select ${activeField === 'destination' ? 'Destination' : 'Pickup'}`}
                    </span>
                </div>
            )}

            {/* Floating 'Locate Me' Button */}
            <button
                onClick={handleLocateUser}
                type="button"
                className="absolute bottom-6 right-6 z-20 pointer-events-auto bg-white text-black p-3.5 rounded-full shadow-2xl hover:bg-gray-100 active:scale-95 transition flex items-center justify-center border border-gray-200"
                title="Use My Current Location"
            >
                <i className="ri-crosshair-2-line text-xl text-black"></i>
            </button>

            {/* Selected location pill at bottom left */}
            {selectedAddress && (
                <div className="absolute bottom-6 left-6 z-20 pointer-events-auto hidden md:flex items-center gap-2 bg-white/90 text-gray-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold backdrop-blur-md border border-gray-200 max-w-sm truncate">
                    <i className="ri-map-pin-fill text-black text-base"></i>
                    <span className="truncate">{selectedAddress}</span>
                </div>
            )}
        </div>
    );
};

export default LiveTracking;