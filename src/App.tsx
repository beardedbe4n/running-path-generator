import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { LocationService } from './services/LocationService';
import { RouteService, RoutePoint } from './services/RouteService';
import { GeocodingService } from './services/GeocodingService';

// Replace this with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyABUgCkWoLM5DrAnh7BeF0rzNbCXak7hv0';

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<RoutePoint>({
    latitude: 40.7128,
    longitude: -74.0060
  });
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState(3219); // ~2 miles in meters
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<RoutePoint[]>([]);

  const locationService = new LocationService();
  const routeService = new RouteService();
  const geocodingService = new GeocodingService();

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });

    loader.load().then(() => {
      if (mapRef.current && !googleMapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: currentLocation.latitude, lng: currentLocation.longitude },
          zoom: 15,
          mapTypeId: 'roadmap',
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true
        });
        googleMapRef.current = map;
      }
    });
  }, []);

  useEffect(() => {
    if (googleMapRef.current) {
      drawRoute();
    }
  }, [route]);

  const drawRoute = () => {
    if (!googleMapRef.current) return;

    // Clear existing polylines
    googleMapRef.current.data.forEach((feature) => {
      googleMapRef.current?.data.remove(feature);
    });

    if (route.length > 0) {
      const path = route.map(point => ({
        lat: point.latitude,
        lng: point.longitude
      }));

      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#4285F4',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      polyline.setMap(googleMapRef.current);

      // Add markers for start and end
      new google.maps.Marker({
        position: path[0],
        map: googleMapRef.current,
        title: 'Start',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        }
      });

      new google.maps.Marker({
        position: path[path.length - 1],
        map: googleMapRef.current,
        title: 'Finish',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      });

      // Fit bounds to show entire route
      const bounds = new google.maps.LatLngBounds();
      path.forEach(point => bounds.extend(point));
      googleMapRef.current.fitBounds(bounds);
    }
  };

  const handleLocationFromAddress = async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      const location = await geocodingService.getCoordinatesFromAddress(address);
      setCurrentLocation(location);
      if (googleMapRef.current) {
        googleMapRef.current.setCenter({ lat: location.latitude, lng: location.longitude });
        googleMapRef.current.setZoom(15);
      }
    } catch (error) {
      console.error('Failed to get location from address:', error);
      alert('Could not find the specified address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const location = await locationService.getCurrentLocation();
      setCurrentLocation(location);
      if (googleMapRef.current) {
        googleMapRef.current.setCenter({ lat: location.latitude, lng: location.longitude });
        googleMapRef.current.setZoom(15);
      }
    } catch (error) {
      console.error('Failed to get current location:', error);
      alert('Could not get your current location. Please ensure location services are enabled.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRoute = async () => {
    try {
      setIsLoading(true);
      const newRoute = await routeService.generateRoute(currentLocation, distance);
      setRoute(newRoute);
    } catch (error) {
      console.error('Failed to generate route:', error);
      alert('Failed to generate route. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert meters to miles for display
  const metersToMiles = (meters: number) => {
    return (meters / 1609.34).toFixed(1);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="h-3/4" ref={mapRef}></div>
      
      <div className="p-4 bg-white shadow-lg">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLocationFromAddress}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r transition-colors"
            disabled={isLoading}
          >
            Set
          </button>
        </div>

        <button
          onClick={handleCurrentLocation}
          className="w-full mb-4 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded transition-colors"
          disabled={isLoading}
        >
          Use Current Location
        </button>

        <div className="mb-4">
          <label className="block text-lg mb-2">Distance (miles)</label>
          <input
            type="range"
            min="1609"
            max="16093"
            step="805"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center">{metersToMiles(distance)} miles</div>
        </div>

        <button
          onClick={handleGenerateRoute}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded transition-colors"
          disabled={isLoading}
        >
          Generate Route
        </button>

        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;