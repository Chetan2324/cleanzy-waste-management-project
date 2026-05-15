import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './TrackPickup.css';
import { 
  FaTruck, FaMapMarkerAlt, FaPhoneAlt, FaStar, FaChevronRight, 
  FaCheckCircle, FaClock, FaShieldAlt, FaLeaf, FaExternalLinkAlt, 
  FaExclamationCircle, FaDotCircle, FaPen, FaTimes, FaSave,
  FaBan, FaTimesCircle, FaExclamationTriangle 
} from 'react-icons/fa';

// --- CUSTOM MAP ICONS ---
const truckIcon = new L.DivIcon({
  className: 'custom-truck-icon',
  html: `<div class="truck-marker-wrapper"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H112C85.5 0 64 21.5 64 48v48H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h272c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H64v128c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z"></path></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const homeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const TrackPickup = () => {
  const navigate = useNavigate();
  const { pickupId } = useParams();

  // --- MAIN STATE ---
  const [pickupData, setPickupData] = useState(null);
  const [status, setStatus] = useState(2); // 0:Scheduled, 1:Assigned, 2:On Way, 3:Completed
  const [eta, setEta] = useState(12); // Minutes
  const [distance, setDistance] = useState(3.5); // km
  const [truckCoords, setTruckCoords] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- STATE: INSTRUCTIONS MODAL ---
  const [showInstModal, setShowInstModal] = useState(false);
  const [instructionText, setInstructionText] = useState("");
  const [isSavingInst, setIsSavingInst] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // --- STATE: CANCEL MODAL ---
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // --- LOAD PICKUP DATA ---
  useEffect(() => {
    const allPickups = JSON.parse(localStorage.getItem('myPickups') || '[]');
    const found = allPickups.find(p => p.id === pickupId);

    if (found) {
        setPickupData(found);
        setInstructionText(found.instructions || "");
        
        // Check if already cancelled
        if (found.status === 'Cancelled') {
          setIsCancelled(true);
          setEta(0);
        } else {
          // Initialize Truck Position
          const startLat = found.location.lat - 0.015; 
          const startLng = found.location.lng - 0.015;
          setTruckCoords([startLat, startLng]);
        }
    }
    setLoading(false);
  }, [pickupId]);

  // --- SIMULATION EFFECT ---
  useEffect(() => {
    if (status === 2 && !completed && !isCancelled && pickupData && truckCoords) {
      const interval = setInterval(() => {
        setTruckCoords(prev => {
          const targetLat = pickupData.location.lat;
          const targetLng = pickupData.location.lng;
          
          const latDiff = targetLat - prev[0];
          const lngDiff = targetLng - prev[1];
          
          if (Math.abs(latDiff) < 0.0002 && Math.abs(lngDiff) < 0.0002) {
            clearInterval(interval);
            setStatus(3);
            setCompleted(true);
            return [targetLat, targetLng];
          }

          return [prev[0] + latDiff * 0.02, prev[1] + lngDiff * 0.02];
        });

        setEta(prev => Math.max(0, (prev - 0.1).toFixed(1)));
        setDistance(prev => Math.max(0, (prev - 0.05).toFixed(2)));

      }, 500); 
      return () => clearInterval(interval);
    }
  }, [status, completed, isCancelled, pickupData]);

  // --- HANDLERS: INSTRUCTIONS ---
  const handleOpenInstModal = () => {
    if (completed || isCancelled) return; 
    setInstructionText(pickupData.instructions || "");
    setShowInstModal(true);
  };

  const handleSaveInstructions = () => {
    if (instructionText.length > 200) return;
    setIsSavingInst(true);

    setTimeout(() => {
      const updatedPickup = { 
        ...pickupData, 
        instructions: instructionText,
        lastUpdated: new Date().toISOString() 
      };
      setPickupData(updatedPickup);
      
      const allPickups = JSON.parse(localStorage.getItem('myPickups') || '[]');
      const updatedList = allPickups.map(p => p.id === pickupId ? updatedPickup : p);
      localStorage.setItem('myPickups', JSON.stringify(updatedList));

      setLastUpdated(new Date());
      setIsSavingInst(false);
      setShowInstModal(false);
    }, 1000);
  };

  const getTimeAgo = () => {
    if (!lastUpdated) return "";
    const diff = Math.floor((new Date() - lastUpdated) / 60000);
    return diff < 1 ? "Just now" : `${diff} mins ago`;
  };

  // --- HANDLERS: CANCELLATION ---
  const handleCancelClick = () => {
    if (eta < 2) {
      alert("Driver is arriving soon! Please call the driver to cancel.");
      return;
    }
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason) return;
    setIsCancelling(true);

    setTimeout(() => {
        const allPickups = JSON.parse(localStorage.getItem('myPickups') || '[]');
        const updatedList = allPickups.map(p => {
            if (p.id === pickupId) {
                return { 
                  ...p, 
                  status: 'Cancelled', 
                  cancelReason: cancelReason === 'Other' ? otherReason : cancelReason 
                };
            }
            return p;
        });
        localStorage.setItem('myPickups', JSON.stringify(updatedList));

        setIsCancelled(true);
        setIsCancelling(false);
        setShowCancelModal(false);
    }, 1500);
  };

  const timelineSteps = [
    { label: "Scheduled", time: "09:30 AM", icon: <FaClock/> },
    { label: "Assigned", time: "09:45 AM", icon: <FaShieldAlt/> },
    { label: "On the Way", time: "Live", icon: <FaTruck/> },
    { label: "Completed", time: "Pending", icon: <FaCheckCircle/> }
  ];

  if (loading) return <div style={{color:'white', textAlign:'center', marginTop:'100px'}}>Loading Pickup...</div>;
  if (!pickupData) return <div style={{color:'white', textAlign:'center', marginTop:'100px'}}>Pickup Not Found</div>;

  return (
    <div className="track-page">
      <Navbar />
      
      <div className="track-container">
        
        {/* === HEADER === */}
        <div className="track-header-row">
          <div>
            <div className={`live-badge ${isCancelled ? 'cancelled' : ''}`}>
               {isCancelled ? <FaBan/> : (completed ? <FaCheckCircle/> : <FaDotCircle className="pulse-icon"/>)}
               {isCancelled ? 'CANCELLED' : (completed ? 'PICKUP COMPLETE' : 'LIVE TRACKING')}
            </div>
            <h1>Tracking #{pickupId}</h1>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Dashboard</button>
            {!isCancelled && (
              <button 
                className="btn-primary" 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${pickupData.location.lat},${pickupData.location.lng}`)}
              >
                <FaExternalLinkAlt/> Open Maps
              </button>
            )}
          </div>
        </div>

        {isCancelled ? (
            // === CANCELLED STATE ===
            <div className="cancelled-hero">
                <div className="hero-icon red"><FaBan/></div>
                <h2>Pickup Cancelled</h2>
                <p>This request was cancelled on {new Date().toLocaleDateString()}.</p>
                <div className="reason-badge">Reason: {pickupData?.cancelReason || cancelReason || 'User Request'}</div>
                <button className="btn-primary-lg" onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
            </div>
        ) : completed ? (
           // === COMPLETION STATE ===
           <div className="completion-hero">
              <div className="hero-icon"><FaCheckCircle/></div>
              <h2>Pickup Successfully Completed!</h2>
              <p>Waste collected: <strong>~5 kg</strong> • EcoPoints Earned: <strong>+50 XP</strong></p>
              <div className="rating-box">
                 <p>Rate Driver</p>
                 <div className="stars">
                    {[1,2,3,4,5].map(s => <FaStar key={s}/>)}
                 </div>
              </div>
              <button className="btn-primary-lg" onClick={() => navigate('/dashboard')}>Return Home</button>
           </div>
        ) : (
           // === LIVE TRACKING GRID ===
           <div className="track-grid-layout">
              
              {/* LEFT PANEL */}
              <div className="track-left-panel">
                 
                 {/* 1. Status Timeline */}
                 <div className="status-card">
                    <h3>Pickup Status</h3>
                    <div className="timeline-vertical">
                       {timelineSteps.map((step, idx) => (
                          <div key={idx} className={`t-step ${idx <= status ? 'active' : ''} ${idx === status ? 'current' : ''}`}>
                             <div className="t-icon">{step.icon}</div>
                             <div className="t-content">
                                <span className="t-label">{step.label}</span>
                                <span className="t-time">{step.time}</span>
                             </div>
                             {idx !== timelineSteps.length - 1 && <div className="t-line"></div>}
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* 2. Driver Card */}
                 <div className="driver-card-modern">
                    <div className="card-top">
                       <div className="driver-avatar">RP</div>
                       <div className="driver-info">
                          <h4>Rahul Patil</h4>
                          <span className="v-badge"><FaShieldAlt/> Verified Driver</span>
                          <div className="rating"><FaStar/> 4.9 (120 reviews)</div>
                       </div>
                       <button className="btn-call-icon"><FaPhoneAlt/></button>
                    </div>
                    <div className="vehicle-info">
                       <FaTruck/> <span>Tata Ace (Green) • <strong>DL-10-4590</strong></span>
                    </div>
                 </div>

                 {/* 3. Actions */}
                 <div className="action-grid">
                    <button 
                      className="btn-action-tile" 
                      onClick={handleOpenInstModal}
                    >
                      <FaPen style={{marginBottom:'5px'}}/> Update Instructions
                    </button>
                    <button 
                      className="btn-action-tile danger"
                      onClick={handleCancelClick}
                      disabled={eta < 2}
                    >
                      <FaBan style={{marginBottom:'5px'}}/> Cancel Pickup
                    </button>
                 </div>

              </div>

              {/* RIGHT PANEL: MAP */}
              <div className="track-right-panel">
                 <div className="map-wrapper-lg">
                    <MapContainer 
                      center={[pickupData.location.lat, pickupData.location.lng]} 
                      zoom={13} 
                      scrollWheelZoom={false} 
                      style={{ height: "100%", width: "100%" }}
                    >
                       <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                       
                       {truckCoords && (
                         <Marker position={truckCoords} icon={truckIcon}>
                            <Popup>CleanZy Driver</Popup>
                         </Marker>
                       )}
                       <Marker position={[pickupData.location.lat, pickupData.location.lng]} icon={homeIcon}>
                          <Popup>Your Pickup Location</Popup>
                       </Marker>
                       {truckCoords && (
                         <Polyline positions={[truckCoords, [pickupData.location.lat, pickupData.location.lng]]} color="#22c55e" weight={4} opacity={0.6} dashArray="10, 10" />
                       )}
                    </MapContainer>

                    <div className="floating-stats">
                       <div className="f-stat">
                          <span className="lbl">Estimated Arrival</span>
                          <span className="val">{Math.ceil(eta)} <small>min</small></span>
                       </div>
                       <div className="stat-divider"></div>
                       <div className="f-stat">
                          <span className="lbl">Distance</span>
                          <span className="val">{distance} <small>km</small></span>
                       </div>
                    </div>
                 </div>

                 <div className="pickup-summary-mini">
                    <div className="mini-row">
                       <span className="lbl">Waste Type</span>
                       <span className="val">{pickupData.wasteType}</span>
                    </div>
                    <div className="mini-row">
                       <span className="lbl">Scheduled For</span>
                       <span className="val">{pickupData.date} | {pickupData.slot}</span>
                    </div>
                    {pickupData.instructions && (
                      <div className="mini-row">
                        <span className="lbl">Note</span>
                        <span className="val">{pickupData.instructions}</span>
                      </div>
                    )}
                 </div>

              </div>
           </div>
        )}

        {/* === MODAL: UPDATE INSTRUCTIONS === */}
        {showInstModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Update Pickup Instructions</h3>
                <button className="btn-close" onClick={() => setShowInstModal(false)}><FaTimes /></button>
              </div>
              <div className="modal-body">
                <label>Driver Notes</label>
                <textarea 
                  value={instructionText}
                  onChange={(e) => setInstructionText(e.target.value)}
                  placeholder="e.g. Please ring the doorbell twice..."
                  maxLength={200}
                  rows={4}
                />
                <div className="char-count">
                  <span className={instructionText.length >= 200 ? "text-red" : ""}>{instructionText.length}/200</span>
                </div>
                {lastUpdated && <p className="last-updated">Last updated: {getTimeAgo()}</p>}
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowInstModal(false)}>Cancel</button>
                <button className="btn-save" onClick={handleSaveInstructions} disabled={isSavingInst}>
                  {isSavingInst ? "Saving..." : <><FaSave/> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === MODAL: CANCEL PICKUP === */}
        {showCancelModal && (
            <div className="modal-overlay">
                <div className="modal-card danger-theme">
                    <div className="modal-header">
                        <h3>Cancel Pickup?</h3>
                        <button className="btn-close" onClick={() => setShowCancelModal(false)}><FaTimesCircle/></button>
                    </div>
                    <div className="modal-body">
                        <div className="warning-box">
                            <FaExclamationTriangle />
                            <p>Are you sure? This action cannot be undone.</p>
                        </div>
                        <label>Reason for Cancellation</label>
                        <select 
                            value={cancelReason} 
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="reason-select"
                        >
                            <option value="">Select a reason...</option>
                            <option value="Changed my mind">Changed my mind</option>
                            <option value="Found another solution">Found another solution</option>
                            <option value="Driver delayed">Driver is delayed</option>
                            <option value="Mistake booking">Booked by mistake</option>
                            <option value="Other">Other</option>
                        </select>
                        {cancelReason === 'Other' && (
                            <textarea 
                                className="other-reason-text"
                                placeholder="Please specify..."
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                            />
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn-cancel" onClick={() => setShowCancelModal(false)}>Keep Pickup</button>
                        <button 
                            className="btn-confirm-danger" 
                            onClick={handleConfirmCancel}
                            disabled={!cancelReason || isCancelling}
                        >
                            {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default TrackPickup;