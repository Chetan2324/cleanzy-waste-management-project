import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../assets/css/AdminDashboard.css';
import './SchedulePickup.css';
import '../assets/css/Maintenance.css'; // Ensure this exists

import { 
  FaRecycle, FaTrash, FaLaptop, FaCouch, FaCalendarAlt, FaClock, 
  FaMapMarkerAlt, FaCheckCircle, FaLeaf, FaArrowRight, FaArrowLeft, 
  FaSearch, FaSpinner, FaExclamationTriangle, FaLocationArrow, FaShieldAlt, FaUserCheck, FaTruck, FaBan
} from 'react-icons/fa';

// --- LEAFLET ICON FIX ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- MAP HELPER: RECENTER ---
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => { 
    if(center) map.flyTo(center, 16, { duration: 1.5 }); 
  }, [center, map]);
  return null;
};

const SchedulePickup = () => {
  const navigate = useNavigate();
  
  // --- 1. SETTINGS STATE (NEW) ---
  const [isAllowed, setIsAllowed] = useState(true);
  const [checkingSettings, setCheckingSettings] = useState(true);

  // --- 2. FORM STATE (EXISTING) ---
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    wasteType: '', date: '', slot: '', location: null, address: '', instructions: ''
  });
  
  // Map & Search State
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchError, setSearchError] = useState('');
  const markerRef = useRef(null);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pickupId, setPickupId] = useState(null);

  // --- CONSTANTS ---
  const wasteTypes = [
    { id: 'Dry', label: 'Dry Waste', icon: <FaRecycle />, desc: 'Paper, Plastic, Cartons', eco: 10 },
    { id: 'Wet', label: 'Wet Waste', icon: <FaTrash />, desc: 'Food scraps, Peels', eco: 5 },
    { id: 'E-Waste', label: 'E-Waste', icon: <FaLaptop />, desc: 'Old Tech, Batteries', eco: 30 },
    { id: 'Bulk', label: 'Bulk Waste', icon: <FaCouch />, desc: 'Furniture, Debris', eco: 20 },
  ];

  const slots = [
    { time: '09:00 AM - 11:00 AM', label: 'Morning', recommended: true },
    { time: '05:00 PM - 07:00 PM', label: 'Evening', recommended: false },
  ];

  // --- 3. CHECK PERMISSIONS ON LOAD (NEW) ---
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) { navigate('/login'); return; }

        // Fetch Global Settings
        const { data } = await axios.get('https://cleanzy-waste-management-backend.onrender.com/api/admin/settings', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });

        // 1. Maintenance Mode Check
        if (data.maintenanceMode) {
          navigate('/dashboard'); 
          return;
        }
        
        // 2. Feature Flag Check
        if (data.allowPickupScheduling === false) {
          setIsAllowed(false);
        }
      } catch (error) {
        console.error("Settings Check Error:", error);
      } finally {
        setCheckingSettings(false);
      }
    };
    checkPermission();
  }, [navigate]);

  // --- 4. RENDER BLOCKED STATE (NEW) ---
  if (!checkingSettings && !isAllowed) {
    return (
      <div className="schedule-page">
        <Navbar />
        <div className="blocked-container animate-fade-in" style={{marginTop:'100px'}}>
          <div className="blocked-box">
            <h2 className="blocked-title"><FaBan /> Service Unavailable</h2>
            <p style={{color:'#a1a1aa', lineHeight:'1.6'}}>
              Pickup scheduling services are currently paused by the administration.
              Please try again later.
            </p>
            <button 
              className="btn-secondary-action" 
              style={{marginTop:'20px', width:'100%', padding:'12px', background:'transparent', border:'1px solid #3f3f46', color:'white', borderRadius:'8px', cursor:'pointer'}} 
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- HANDLERS (EXISTING) ---
  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError('');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const newPos = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        setMapCenter([newPos.lat, newPos.lng]);
        setFormData({ ...formData, location: newPos, address: data[0].display_name });
      } else {
        setSearchError("Location not found.");
      }
    } catch (err) { setSearchError("Network error."); } 
    finally { setIsSearching(false); }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
        setMapCenter([newPos.lat, newPos.lng]);
        setFormData({ ...formData, location: newPos, address: "Current Location" });
        setIsLocating(false);
      },
      () => { setIsLocating(false); setSearchError("Unable to retrieve location."); }
    );
  };

  const LocationMarker = () => {
    useMapEvents({ click(e) { setFormData({ ...formData, location: e.latlng, address: "Pinned Location" }); } });
    if (!formData.location) return null;
    return (
      <Marker draggable={true} position={formData.location} ref={markerRef}>
        <Popup>Pickup Point</Popup>
      </Marker>
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' }
      };

      const fullAddress = `${formData.address} | Slot: ${formData.slot} | Note: ${formData.instructions || 'None'}`;
      let backendWasteType = formData.wasteType;
      if (formData.wasteType === 'Bulk') backendWasteType = 'Bulk/Furniture';

      const payload = {
        wasteType: backendWasteType,
        address: fullAddress,
        scheduledDate: formData.date
      };

      const { data } = await axios.post('https://cleanzy-waste-management-backend.onrender.com/api/pickups', payload, config);

      if (data.success) {
        setPickupId(data.pickup._id || data.pickup.id);
        setIsSuccess(true);
        toast.success("Pickup scheduled successfully!");
      }
    } catch (error) {
      console.error("Schedule Error:", error);
      toast.error(error.response?.data?.message || "Failed to schedule pickup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentWaste = wasteTypes.find(w => w.id === formData.wasteType);
  const estimatedPoints = currentWaste ? currentWaste.eco + 40 : 50;

  return (
    <div className="schedule-page">
      <Navbar />
      
      <div className="schedule-container">
        {isSuccess ? (
          // === SUCCESS CARD ===
          <div className="success-wrapper animate-fade-in">
            <div className="success-card-glow">
              <div className="success-header">
                <div className="pulse-check"><FaCheckCircle /></div>
                <h2>Pickup Scheduled!</h2>
                <p>Your pickup ID is <strong>#{pickupId?.slice(-6).toUpperCase()}</strong>.</p>
              </div>
              <div className="success-summary-grid">
                 <div className="s-item">
                    <span className="lbl">Date</span>
                    <span className="val">{formData.date}</span>
                 </div>
                 <div className="s-item">
                    <span className="lbl">Type</span>
                    <span className="val">{formData.wasteType}</span>
                 </div>
                 <div className="s-item">
                    <span className="lbl">Earned</span>
                    <span className="val green">+{estimatedPoints} XP</span>
                 </div>
              </div>
              <div className="success-actions">
                <button className="btn-dashboard" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                <button className="btn-outline" onClick={() => navigate(`/track-pickup/${pickupId}`)}>Track Pickup</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="schedule-grid">
            
            {/* === LEFT: FORM WIZARD === */}
            <div className="schedule-form-card">
              
              {/* Progress Bar */}
              <div className="stepper-container">
                <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                <div className={`step-bar ${step >= 2 ? 'active' : ''}`}></div>
                <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                <div className={`step-bar ${step >= 3 ? 'active' : ''}`}></div>
                <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
                <div className={`step-bar ${step >= 4 ? 'active' : ''}`}></div>
                <div className={`step-dot ${step >= 4 ? 'active' : ''}`}>4</div>
              </div>
              
              <div className="step-labels">
                 <span>Type</span><span>Location</span><span>Time</span><span>Done</span>
              </div>

              {/* STEP 1: WASTE TYPE */}
              {step === 1 && (
                <div className="step-content fade-in">
                  <h2>Select Waste Type</h2>
                  <p className="step-subtitle">Identify the waste category for optimization.</p>
                  <div className="waste-grid">
                    {wasteTypes.map((type) => (
                      <div key={type.id} className={`waste-card ${formData.wasteType === type.id ? 'selected' : ''}`} onClick={() => setFormData({...formData, wasteType: type.id})}>
                        <div className="waste-icon">{type.icon}</div>
                        <h3>{type.label}</h3>
                        <span>{type.desc}</span>
                        {formData.wasteType === type.id && <FaCheckCircle className="check-badge"/>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: SMART MAP */}
              {step === 2 && (
                <div className="step-content fade-in">
                  <h2>Pickup Location</h2>
                  <p className="step-subtitle">Search your area or use GPS.</p>
                  
                  <div className="location-tools">
                    <div className="search-box">
                      <FaSearch className="search-icon"/>
                      <input 
                        type="text" 
                        placeholder="Enter landmark, society, or area..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                      />
                      {isSearching && <FaSpinner className="spin search-spinner"/>}
                    </div>
                    <button className="btn-gps" onClick={handleGeolocation} disabled={isLocating}>
                      {isLocating ? <FaSpinner className="spin"/> : <FaLocationArrow />} My Location
                    </button>
                  </div>
                  {searchError && <div className="error-pill"><FaExclamationTriangle/> {searchError}</div>}

                  <div className="map-frame">
                    <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                      <MapRecenter center={mapCenter} />
                      <LocationMarker />
                    </MapContainer>
                    {formData.location && <div className="drag-hint">Tip: You can drag the marker to pinpoint exact location.</div>}
                  </div>
                </div>
              )}

              {/* STEP 3: DATE & TIME */}
              {step === 3 && (
                <div className="step-content fade-in">
                  <h2>Date & Time</h2>
                  <p className="step-subtitle">When should we arrive?</p>
                  
                  <div className="date-wrapper">
                     <label>Pickup Date</label>
                     <input type="date" className="date-input" onChange={(e) => setFormData({...formData, date: e.target.value})} value={formData.date} min={new Date().toISOString().split("T")[0]}/>
                  </div>

                  <div className="slots-container">
                    {slots.map((slot, index) => (
                      <button key={index} className={`slot-card ${formData.slot === slot.time ? 'selected' : ''}`} onClick={() => setFormData({...formData, slot: slot.time})}>
                        <div className="slot-top">
                           <FaClock /> <span>{slot.label}</span>
                           {slot.recommended && <span className="rec-badge">Recommended</span>}
                        </div>
                        <div className="slot-time">{slot.time}</div>
                      </button>
                    ))}
                  </div>

                  <div className="instructions-box">
                     <label>Instructions (Optional)</label>
                     <textarea placeholder="e.g. Call security upon arrival..." rows="2" onChange={(e) => setFormData({...formData, instructions: e.target.value})} value={formData.instructions}></textarea>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {step === 4 && (
                <div className="step-content fade-in">
                  <h2>Review Details</h2>
                  <p className="step-subtitle">Confirm your pickup request.</p>
                  <div className="review-card">
                     <div className="r-row">
                        <span className="r-label">Waste Type</span>
                        <span className="r-val">{wasteTypes.find(w => w.id === formData.wasteType)?.label}</span>
                     </div>
                     <div className="r-row">
                        <span className="r-label">Location</span>
                        <span className="r-val">{formData.location ? `${formData.location.lat.toFixed(4)}, ${formData.location.lng.toFixed(4)}` : 'N/A'}</span>
                     </div>
                     <div className="r-row">
                        <span className="r-label">Time</span>
                        <span className="r-val">{formData.date} | {formData.slot.split(' ')[0]}</span>
                     </div>
                     {formData.instructions && (
                       <div className="r-row inst">
                          <span className="r-label">Note</span>
                          <span className="r-val">{formData.instructions}</span>
                       </div>
                     )}
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="form-actions">
                {step > 1 && <button className="btn-back" onClick={handleBack}><FaArrowLeft/> Back</button>}
                {step < 4 ? (
                   <button className="btn-next" onClick={handleNext} disabled={(step === 1 && !formData.wasteType) || (step === 2 && !formData.location) || (step === 3 && (!formData.date || !formData.slot))}>
                     Next Step <FaArrowRight/>
                   </button>
                ) : (
                   <button className="btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
                     {isSubmitting ? 'Scheduling...' : 'Confirm Pickup'}
                   </button>
                )}
              </div>
            </div>

            {/* === RIGHT: IMPACT SIDEBAR === */}
            <div className="schedule-sidebar">
               {/* Impact Card */}
               <div className="sidebar-widget impact-preview">
                  <h3><FaLeaf style={{color:'#22c55e'}}/> Impact Preview</h3>
                  <div className="impact-stats">
                     <div className="i-stat">
                        <span className="val">{currentWaste ? currentWaste.eco : 0}kg</span>
                        <span className="lbl">CO₂ Reduced</span>
                     </div>
                     <div className="i-stat">
                        <span className="val">+{estimatedPoints}</span>
                        <span className="lbl">EcoPoints</span>
                     </div>
                  </div>
                  <div className="progress-mini">
                     <div className="bar-fill" style={{width: formData.wasteType ? '100%' : '20%'}}></div>
                  </div>
                  <p className="impact-note">Estimates based on typical {formData.wasteType || 'waste'} volume.</p>
               </div>

               {/* Trust Footer */}
               <div className="trust-badges">
                  <div className="badge"><FaShieldAlt/> Verified Staff</div>
                  <div className="badge"><FaUserCheck/> Zero Contact</div>
                  <div className="badge"><FaTruck/> Live Tracking</div>
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePickup;