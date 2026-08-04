import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const LiveTracking = ({ onLocationSelect, activeField = 'pickup' }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const onLocationSelectRef = useRef(onLocationSelect);
    const [ selectedAddress, setSelectedAddress ] = useState('');
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        onLocationSelectRef.current = onLocationSelect;
    }, [ onLocationSelect ]);

    // Custom OPERs pin marker icon
    const uberMarkerIcon = L.divIcon({
        className: 'custom-uber-pin',
        html: `
            <div style="
                width: 40px;
                height: 40px;
                background-color: #000000;
                border: 3.5px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 6px 16px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: grab;
                transition: transform 0.2s ease;
            ">
                <div style="width: 12px; height: 12px; background-color: #ffffff; border-radius: 3px;"></div>
            </div>
        `,
        iconSize: [ 40, 40 ],
        iconAnchor: [ 20, 20 ]
    });

    // Helper for reverse geocoding lat, lng into human readable address
    const updateLocation = async (lat, lng) => {
        setLoading(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
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
                        mapInstanceRef.current.setView([ latitude, longitude ], 16, { animate: true });
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

    useEffect(() => {
        if (!mapRef.current) return;

        if (!mapInstanceRef.current) {
            // Default center
            const initialLat = 28.6139;
            const initialLng = 77.2090;

            const map = L.map(mapRef.current, {
                center: [ initialLat, initialLng ],
                zoom: 15,
                zoomControl: false
            });

            // CartoDB Voyager clean silver map tiles
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
                maxZoom: 19
            }).addTo(map);

            // Draggable pin marker
            const marker = L.marker([ initialLat, initialLng ], {
                icon: uberMarkerIcon,
                draggable: true
            }).addTo(map);

            // Drag end event listener
            marker.on('dragend', (e) => {
                const position = e.target.getLatLng();
                map.setView([ position.lat, position.lng ], map.getZoom(), { animate: true });
                updateLocation(position.lat, position.lng);
            });

            // Map click listener (Click anywhere on map to set pin)
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

            {/* Instruction Banner at top center */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2 bg-black/80 text-white px-4 py-2 rounded-full shadow-lg text-sm backdrop-blur-md font-medium border border-white/20">
                <i className="ri-map-pin-2-fill text-yellow-400"></i>
                <span>
                    {loading ? 'Fetching location...' : `Tap map to select ${activeField === 'destination' ? 'Destination' : 'Pickup'}`}
                </span>
            </div>

            {/* Floating 'Locate Me' Button */}
            <button
                onClick={handleLocateUser}
                type="button"
                className="absolute bottom-6 right-6 z-20 pointer-events-auto bg-white text-black p-3.5 rounded-full shadow-2xl hover:bg-gray-100 active:scale-95 transition flex items-center justify-center border border-gray-200"
                title="Use My Current Location"
            >
                <i className="ri-crosshair-2-line text-xl text-black"></i>
            </button>

            {/* Selected location pill at bottom center */}
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