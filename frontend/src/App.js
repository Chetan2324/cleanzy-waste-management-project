import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

// --- COMPONENT IMPORTS ---
import ProtectedRoute from './components/ProtectedRoute';

// --- PUBLIC PAGE IMPORTS ---
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import MaintenancePage from './pages/MaintenancePage'; // ✅ NEW IMPORT

// --- USER PAGE IMPORTS ---
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import MyIssues from './pages/MyIssues'; 
import SchedulePickup from './pages/SchedulePickup';
import TrackPickup from './pages/TrackPickup';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings'; 

// --- ADMIN IMPORTS ---
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminIssues from './pages/admin/AdminIssues';
import AdminUsers from './pages/admin/AdminUsers'; 
import AdminPickups from './pages/admin/AdminPickups';
import AdminSettings from './pages/admin/AdminSettings'; 

function App() {
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <Routes>
        {/* =============================
            PUBLIC ROUTES 
        ============================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* ✅ Maintenance Route (Publicly Accessible) */}
        <Route path="/maintenance" element={<MaintenancePage />} />

        {/* =============================
            AUTHENTICATED ROUTES 
            (Protected by JWT + Maintenance Check)
        ============================= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/my-issues" element={<MyIssues />} />
          <Route path="/schedule-pickup" element={<SchedulePickup />} />
          <Route path="/track-pickup/:pickupId" element={<TrackPickup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* =============================
            ADMIN ROUTES 
            (Protected by JWT, Admins Bypass Maintenance)
        ============================= */}
        <Route element={<ProtectedRoute />}> 
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="issues" element={<AdminIssues />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="pickups" element={<AdminPickups />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

      </Routes>
    </div>
  );
}

export default App;