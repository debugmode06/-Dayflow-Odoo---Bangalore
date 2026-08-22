// Office configuration - fallback values if not provided globally
export const OFFICE_LOCATION = {
  latitude: 12.9716, // Bangalore default
  longitude: 77.5946,
  allowedRadiusMeters: 150,
};

// Calculate distance between two coordinates in meters using the Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
};

/**
 * Verify if the user's current device location is within the office geofence.
 * @returns {Promise<{ verified: boolean, distance: number | null, error: string | null }>}
 */
export const verifyPresence = async () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        verified: false,
        distance: null,
        error: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = calculateDistance(
          latitude,
          longitude,
          OFFICE_LOCATION.latitude,
          OFFICE_LOCATION.longitude
        );

        const isVerified = distance <= OFFICE_LOCATION.allowedRadiusMeters;

        resolve({
          verified: isVerified,
          distance: Math.round(distance),
          error: null,
        });
      },
      (error) => {
        let errorMsg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied. Please allow access to verify presence.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out.';
        }
        resolve({
          verified: false,
          distance: null,
          error: errorMsg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};
