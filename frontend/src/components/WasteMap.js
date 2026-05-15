import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MdLocationOn } from 'react-icons/md';

const getMarkerIcon = (status) => {
    let color = '#e74c3c'; // Red
    if (status === 'In Progress') color = '#f39c12'; // Orange
    if (status === 'Resolved') color = '#2ecc71'; // Green

    const isActive = status !== 'Resolved';
    
    return L.divIcon({
        className: 'pulse-icon',
        html: `
            <div class="ring" style="background-color: ${color}; display: ${isActive ? 'block' : 'none'}"></div>
            <div class="dot" style="background-color: ${color}; border: 2px solid white;"></div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -10]
    });
};

const WasteMap = ({ reports }) => {
    // Default fallback center (New Delhi)
    const defaultCenter = [28.6139, 77.2090]; 

    // Find the center based on the most recent report, or use default
    // This makes the map auto-center on your reported area!
    const mapCenter = reports.length > 0 && reports[0].location 
        ? [reports[0].location.lat, reports[0].location.lng] 
        : defaultCenter;

    return (
        <div style={{ 
            height: '450px', 
            width: '100%', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
            border: '4px solid white',
            position: 'relative'
        }}>
            {/* key={JSON.stringify(mapCenter)} forces the map to re-center if data changes */}
            <MapContainer 
                key={JSON.stringify(mapCenter)}
                center={mapCenter} 
                zoom={10} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                
                {reports.map((report) => (
                    // Only render markers that have valid location data
                    report.location && report.location.lat && (
                        <Marker 
                            key={report._id} 
                            position={[report.location.lat, report.location.lng]}
                            icon={getMarkerIcon(report.status)}
                        >
                            <Popup>
                                <div style={{ padding: '15px' }}>
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#2c3e50' }}>
                                        {report.type}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '10px' }}>
                                        <MdLocationOn /> {report.address}
                                    </div>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '12px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '600',
                                        backgroundColor: report.status === 'Resolved' ? '#e8f5e9' : '#ffebee',
                                        color: report.status === 'Resolved' ? '#2ecc71' : '#e74c3c'
                                    }}>
                                        {report.status}
                                    </span>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
            
            {/* Legend */}
            <div style={{
                position: 'absolute', bottom: '20px', right: '20px', background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', zIndex: 1000, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}><div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#e74c3c'}}></div><span>Critical</span></div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}><div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#f39c12'}}></div><span>In Progress</span></div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}><div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#2ecc71'}}></div><span>Resolved</span></div>
            </div>
        </div>
    );
};

export default WasteMap;