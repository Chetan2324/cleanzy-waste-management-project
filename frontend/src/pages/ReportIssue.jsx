import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import Navbar from '../components/Navbar';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import CSS
import './ReportIssue.css'; 
import '../assets/css/Maintenance.css'; 

import { 
  FaCamera, FaCheckCircle, FaRobot, 
  FaSearch, FaSpinner, FaExclamationTriangle, FaLeaf, FaArrowRight, FaBan, FaTimes, FaClock // ✅ Added FaClock
} from 'react-icons/fa';

// Leaflet Icon Fix
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

const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 2 });
  }, [center, map]);
  return null;
};

const ReportIssue = () => {
  const navigate = useNavigate();
  
  // Settings State
  const [isAllowed, setIsAllowed] = useState(true);
  const [checkingSettings, setCheckingSettings] = useState(true);

  // Form State
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [formData, setFormData] = useState({ 
    type: 'Overflowing Bin', 
    description: '' 
  });

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [completion, setCompletion] = useState(0);

  const issueCategories = [
    'Missed Pickup',
    'Overflowing Bin',
    'Broken Bin',
    'Other'
  ];

  // --- 1. CHECK SETTINGS ON LOAD ---
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) { navigate('/login'); return; }

        const { data } = await axios.get('https://cleanzy-waste-management-backend.onrender.com/api/admin/settings', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        
        if (data.maintenanceMode) {
          navigate('/dashboard'); 
        }
        
        if (data.allowIssueReporting === false) {
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

  useEffect(() => {
    let count = 0;
    if (file) count++;
    if (formData.description.trim().length > 10) count++;
    if (location) count++;
    setCompletion(count); 
  }, [file, formData.description, location]);

  // --- 2. RENDER BLOCKED STATE ---
  if (!checkingSettings && !isAllowed) {
    return (
      <div className="report-page">
        <Navbar />
        <div className="blocked-container animate-fade-in" style={{marginTop:'100px'}}>
          <div className="blocked-box">
            <h2 className="blocked-title"><FaBan /> Feature Disabled</h2>
            <p style={{color:'#a1a1aa', lineHeight:'1.6'}}>
              Issue reporting is currently disabled by the administration. 
              Please check back later or contact support for urgent matters.
            </p>
            <button 
              className="btn-cancel" 
              style={{marginTop:'20px', width:'100%', padding:'12px', background:'transparent', border:'1px solid #3f3f46', color:'white', borderRadius:'8px', cursor:'pointer'}} 
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      simulateAIAnalysis(selected.name);
    }
  };

  const simulateAIAnalysis = (fileName) => {
    setAnalyzing(true);
    setAiResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setAiResult({
        category: 'Mixed Plastic & Organic Overflow',
        severity: 'High',
        confidence: '94%'
      });
      setFormData(prev => ({ ...prev, description: `[AI Auto-Detect: ${fileName}] Substantial overflow detected. Requires immediate attention.` }));
    }, 2500);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError('');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setMapCenter([newPos.lat, newPos.lng]);
        setLocation(newPos);
      } else {
        setSearchError("Location not found in database.");
      }
    } catch (err) { setSearchError("Network error connecting to map service."); } 
    finally { setIsSearching(false); }
  };

  const LocationMarker = () => {
    useMapEvents({ click(e) { setLocation(e.latlng); } });
    if (!location) return null;
    return (
      <Marker position={location}>
        <Popup className="custom-popup">
          <div className="popup-content">
            <strong>Pinned Issue Location</strong>
            <p className="popup-coords">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
          </div>
        </Popup>
      </Marker>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!location) return toast.error("Please pin the issue location on the map.");
    if (!file) return toast.error("Please upload photo evidence.");
    if (formData.description.trim().length < 10) return toast.error("Please provide a more detailed description (min 10 chars).");

    setSubmitting(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' }
      };

      const areaSnapshot = searchQuery ? searchQuery.split(',')[0] : 'Pinned Location';
      const finalTitle = `${formData.type} reported near ${areaSnapshot}`;

      const combinedDescription = `
        [ISSUE DETAILS]
        ${formData.description}
        [LOCATION DATA]
        Search query: ${searchQuery || 'N/A'}
        Coordinates: Lat ${location.lat.toFixed(6)}, Lng ${location.lng.toFixed(6)}
        [SMART ASSISTANT DATA]
        AI Category: ${aiResult?.category || 'N/A'}
        AI Severity: ${aiResult?.severity || 'N/A'}
      `.trim();

      const payload = {
        title: finalTitle,
        category: formData.type,
        description: combinedDescription
      };

      const { data } = await axios.post('https://cleanzy-waste-management-backend.onrender.com/api/issues', payload, config);

      if (data.success) {
        toast.success("Issue Reported Successfully!");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Submission Error:", error);
      const msg = error.response?.data?.message || "Failed to submit report. Please try again.";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-page">
      <Navbar />
      
      <div className="report-container animate-fade-in">
        
        {/* STEPPER HEADER */}
        <div className="stepper-header">
          <div className={`step-item ${completion >= 0 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span>Upload</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${completion >= 1 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span>Details</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${completion >= 2 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span>Location</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${completion >= 3 ? 'active' : ''}`}>
            <div className="step-circle"><FaCheckCircle/></div>
            <span>Submit</span>
          </div>
        </div>

        <div className="report-header">
          <h1>Report an Issue</h1>
          <p>Keep CleanZy green. Snap a photo, pin the location, and our smart assistant handles the rest.</p>
        </div>

        {apiError && (
          <div className="alert-banner error fade-in mb-4">
            <FaExclamationTriangle />
            <span>{apiError}</span>
            <button onClick={() => setApiError(null)} className="close-alert"><FaTimes/></button>
          </div>
        )}

        <div className="report-grid">
          
          {/* LEFT: FORM SECTION */}
          <div className="report-form-card">
            <form onSubmit={handleSubmit}>
              
              {/* SECTION 1: PHOTO */}
              <div className="form-section">
                <label className="section-label">1. Visual Evidence</label>
                <div className="image-upload-wrapper">
                  {preview ? (
                    <div className="image-preview-box">
                      <img src={preview} alt="Evidence" />
                      {!analyzing && aiResult && (
                        <div className="ai-badge"><FaRobot style={{marginRight:'6px'}}/> AI Verified</div>
                      )}
                      {analyzing && (
                         <div className="ai-overlay">
                           <FaSpinner className="spin" /> <span>AI Analysis in progress...</span>
                         </div>
                      )}
                      <button type="button" className="change-img-btn" onClick={() => {setFile(null); setPreview(null); setAiResult(null);}}>Change</button>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <input type="file" accept="image/*" onChange={handleFileChange} hidden required />
                      <div className="upload-icon"><FaCamera /></div>
                      <span>Click to Upload Photo</span>
                      <small>Max size: 5MB (image formats only)</small>
                    </label>
                  )}
                </div>
              </div>

              {/* SECTION 2: DETAILS */}
              <div className="form-section">
                <label className="section-label">2. Issue Details</label>
                <div className="input-group">
                  <label>Category</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required>
                    {issueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea 
                    rows="3" 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    placeholder="Describe the issue in detail (minimum 10 characters)..."
                    required
                    minLength={10}
                  ></textarea>
                </div>
              </div>

              {/* SECTION 3: LOCATION */}
              <div className="form-section">
                <label className="section-label">3. Pin Location</label>
                <div className="location-search-bar">
                  <input 
                    type="text" placeholder="Enter landmark, society name, or area..." 
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                  />
                  <button type="button" onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? <FaSpinner className="spin"/> : <FaSearch />}
                  </button>
                </div>
                {searchError && <p className="search-error-msg animate-fade-in">{searchError}</p>}
                <div className="map-wrapper">
                  <MapContainer center={mapCenter} zoom={13} style={{ height: "300px", width: "100%", borderRadius: "12px" }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    <MapRecenter center={mapCenter} />
                    <LocationMarker />
                  </MapContainer>
                  {location && <p className="location-status success fade-in"><FaCheckCircle/> Coordinates Locked</p>}
                </div>
              </div>

              <button type="submit" className={`submit-report-btn ${completion < 3 || submitting ? 'disabled' : ''}`} disabled={completion < 3 || submitting}>
                {submitting ? <FaSpinner className="spin"/> : "Submit Report"}
              </button>
            </form>
          </div>

          {/* RIGHT: SMART ASSISTANT PANEL */}
          <div className="report-sidebar">
            <div className="smart-panel">
              <h3><FaRobot style={{color:'#22c55e', marginRight:'8px'}}/> Submission Assistant</h3>
              <div className="checklist-item">
                <div className={`check-circle ${file ? 'checked' : ''}`}>{file ? <FaCheckCircle/> : '1'}</div>
                <div className="check-text">
                  <span>Visual Evidence</span>
                  <small>{file ? 'Photo uploaded & verified' : 'Pending photo upload'}</small>
                </div>
              </div>
              <div className="checklist-item">
                <div className={`check-circle ${location ? 'checked' : ''}`}>{location ? <FaCheckCircle/> : '2'}</div>
                <div className="check-text">
                  <span>Location Pin</span>
                  <small>{location ? 'Coordinates locked' : 'Map pin required'}</small>
                </div>
              </div>
              <div className="checklist-item">
                <div className={`check-circle ${formData.description.trim().length >= 10 ? 'checked' : ''}`}>{formData.description.trim().length >= 10 ? <FaCheckCircle/> : '3'}</div>
                <div className="check-text">
                  <span>Detailed Description</span>
                  <small>{formData.description.trim().length >= 10 ? 'Details provided' : 'Min 10 characters required'}</small>
                </div>
              </div>
            </div>

            {aiResult && (
              <div className="smart-panel ai-box animate-fade-in">
                <div className="ai-title">
                  <FaExclamationTriangle /> <span>AI Analysis (Auto-Insight)</span>
                </div>
                <div className="severity-meter">
                  <span>Severity detected: <strong>{aiResult.severity}</strong></span>
                  <div className="meter-bar">
                    <div className="meter-fill" style={{width: '90%', background: '#ef4444'}}></div>
                  </div>
                </div>
                <p className="ai-summary">Mixed waste overflow detected. Priority set to High based on volume.</p>
              </div>
            )}

            <div className="smart-panel impact-box">
              <h3>Your Impact</h3>
              <ul className="impact-list">
                <li><FaLeaf/> <span>Maintain neighborhood hygiene</span></li>
                <li><FaArrowRight/> <span>Optimize collection logistics</span></li>
                <li><FaClock/> <span>Standard resolution within 24 hrs</span></li>
              </ul>
              <div className="points-badge">
                +50 Eco Points on approval
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;