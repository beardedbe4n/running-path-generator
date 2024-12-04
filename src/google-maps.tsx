import React, { useEffect, useRef } from 'react';

const MapComponent = () => {
  const mapRef = useRef(null);
  const apiKey = 'AIzaSyABUgCkWoLM5DrAnh7BeF0rzNbCXak7hv0';

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    const mapOptions = {
      center: { lat: 40.7128, lng: -74.0060 }, // New York coordinates
      zoom: 12,
    };

    new window.google.maps.Map(mapRef.current, mapOptions);
  };

  return (
    <div className="w-full h-screen p-4">
      <div 
        ref={mapRef}
        className="w-full h-full rounded-lg shadow-lg"
      />
    </div>
  );
};

export default MapComponent;