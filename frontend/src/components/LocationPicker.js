import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// 1. Helper to move map view when you search
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15);
    }
  }, [center, map]);
  return null;
}

// 2. NEW Helper to handle Map Clicks
function LocationMarker({ position, onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      // When user clicks the map, send the new Lat/Lng back to parent
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? <Marker position={position} /> : null;
}

const LocationPicker = ({ position, onLocationSelect }) => {
  // Default to India Center if no position yet
  const defaultCenter = [20.5937, 78.9629]; 
  // If we have a position, use it. If not, use default.
  const center = position || defaultCenter;

  return (
    <div style={{ height: '350px', width: '100%', marginTop: '15px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #ddd', zIndex: 0 }}>
      <MapContainer center={center} zoom={position ? 15 : 5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Handles searching */}
        <ChangeView center={position} />
        
        {/* Handles clicking */}
        <LocationMarker position={position} onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;