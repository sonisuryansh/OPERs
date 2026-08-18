const axios = require('axios');
const captainModel = require('../models/captain.model');

// Helper Haversine distance calculator in km
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

module.exports.getAddressCoordinate = async (address) => {
    if (!address) {
        throw new Error('Address is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;

    // 1. Try Google Geocoding if API key is provided
    if (apiKey && apiKey !== 'your_google_maps_api_key_here') {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
        try {
            const response = await axios.get(url);
            if (response.data.status === 'OK' && response.data.results?.length > 0) {
                const location = response.data.results[0].geometry.location;
                return {
                    ltd: location.lat,
                    lng: location.lng
                };
            }
        } catch (error) {
            console.warn('Google Geocode failed, falling back to OpenStreetMap:', error.message);
        }
    }

    // 2. OpenStreetMap Nominatim Fallback
    try {
        const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
        const osmResponse = await axios.get(osmUrl, {
            headers: {
                'User-Agent': 'OPERs-Ride-Hailing-App/1.0'
            },
            timeout: 5000
        });

        if (osmResponse.data && osmResponse.data.length > 0) {
            return {
                ltd: parseFloat(osmResponse.data[0].lat),
                lng: parseFloat(osmResponse.data[0].lon)
            };
        }
    } catch (osmError) {
        console.warn('OSM Geocode fallback error:', osmError.message);
    }

    // 3. Coordinate parsing fallback (if input is already lat,lng or default fallback)
    const match = address.match(/(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/);
    if (match) {
        return {
            ltd: parseFloat(match[1]),
            lng: parseFloat(match[3])
        };
    }

    // Default Delhi NCR fallback coords
    return {
        ltd: 28.6139,
        lng: 77.2090
    };
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;

    // 1. Try Google Distance Matrix API if key is present
    if (apiKey && apiKey !== 'your_google_maps_api_key_here') {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
        try {
            const response = await axios.get(url);
            if (response.data.status === 'OK' && response.data.rows?.[0]?.elements?.[0]?.status === 'OK') {
                return response.data.rows[0].elements[0];
            }
        } catch (err) {
            console.warn('Google Distance Matrix failed, falling back to OSRM:', err.message);
        }
    }

    // 2. High-accuracy OSRM Routing Fallback
    try {
        const originCoords = await module.exports.getAddressCoordinate(origin);
        const destCoords = await module.exports.getAddressCoordinate(destination);

        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destCoords.lng},${destCoords.ltd}?overview=false`;
        const osrmRes = await axios.get(osrmUrl, { timeout: 6000 });

        if (osrmRes.data?.routes?.[0]) {
            const distanceMeters = osrmRes.data.routes[0].distance;
            const durationSeconds = osrmRes.data.routes[0].duration;

            return {
                distance: {
                    text: `${(distanceMeters / 1000).toFixed(1)} km`,
                    value: Math.round(distanceMeters)
                },
                duration: {
                    text: `${Math.ceil(durationSeconds / 60)} mins`,
                    value: Math.round(durationSeconds)
                },
                status: 'OK'
            };
        }
    } catch (osrmErr) {
        console.warn('OSRM routing fallback failed:', osrmErr.message);
    }

    // 3. Mathematical Haversine fallback with realistic driving road multiplier (1.3x)
    try {
        const originCoords = await module.exports.getAddressCoordinate(origin);
        const destCoords = await module.exports.getAddressCoordinate(destination);

        const straightDistanceKm = calculateHaversineDistance(originCoords.ltd, originCoords.lng, destCoords.ltd, destCoords.lng);
        const drivingDistanceKm = Math.max(straightDistanceKm * 1.3, 1.0); // min 1km
        const drivingTimeMins = Math.max(Math.round((drivingDistanceKm / 28) * 60), 3); // ~28km/h avg speed

        return {
            distance: {
                text: `${drivingDistanceKm.toFixed(1)} km`,
                value: Math.round(drivingDistanceKm * 1000)
            },
            duration: {
                text: `${drivingTimeMins} mins`,
                value: Math.round(drivingTimeMins * 60)
            },
            status: 'OK'
        };
    } catch (fallbackErr) {
        console.error('Final distance-time fallback calculation failed:', fallbackErr);
        return {
            distance: { text: '5.0 km', value: 5000 },
            duration: { text: '15 mins', value: 900 },
            status: 'OK'
        };
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;

    // 1. Try Google Places Autocomplete if configured
    if (apiKey && apiKey !== 'your_google_maps_api_key_here') {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
        try {
            const response = await axios.get(url);
            if (response.data.status === 'OK') {
                return response.data.predictions.map(prediction => prediction.description).filter(Boolean);
            }
        } catch (err) {
            console.warn('Google autocomplete failed, falling back to OSM Nominatim:', err.message);
        }
    }

    // 2. OpenStreetMap Nominatim Autocomplete Suggestions
    try {
        const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&addressdetails=1&limit=6`;
        const response = await axios.get(osmUrl, {
            headers: {
                'User-Agent': 'OPERs-Ride-Hailing-App/1.0'
            },
            timeout: 5000
        });

        if (response.data && response.data.length > 0) {
            return response.data.map(item => item.display_name);
        }
    } catch (err) {
        console.warn('OSM autocomplete error:', err.message);
    }

    return [
        `${input}, Connaught Place, New Delhi`,
        `${input}, Aerocity, Delhi Airport`,
        `${input}, Cyber City, Gurugram`,
        `${input}, Sector 62, Noida`,
        `${input}, Lucknow Central, Uttar Pradesh`
    ];
};

module.exports.getRouteGeometry = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const originCoords = await module.exports.getAddressCoordinate(origin);
    const destCoords = await module.exports.getAddressCoordinate(destination);

    try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destCoords.lng},${destCoords.ltd}?overview=full&geometries=geojson`;
        const osrmRes = await axios.get(osrmUrl, { timeout: 8000 });

        if (osrmRes.data?.routes?.[0]?.geometry?.coordinates) {
            // OSRM coordinates are [lng, lat], convert to Leaflet [lat, lng]
            const pathCoordinates = osrmRes.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            const distance = osrmRes.data.routes[0].distance;
            const duration = osrmRes.data.routes[0].duration;

            return {
                coordinates: pathCoordinates,
                originCoords,
                destCoords,
                distance: `${(distance / 1000).toFixed(1)} km`,
                duration: `${Math.ceil(duration / 60)} mins`
            };
        }
    } catch (osrmErr) {
        console.warn('OSRM route geometry error, generating direct path:', osrmErr.message);
    }

    // Direct line fallback if OSRM is unreachable
    return {
        coordinates: [
            [originCoords.ltd, originCoords.lng],
            [destCoords.ltd, destCoords.lng]
        ],
        originCoords,
        destCoords,
        distance: '5.0 km',
        duration: '15 mins'
    };
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;
};