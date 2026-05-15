import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const ProtectedRoute = () => {
  const [isAllowed, setIsAllowed] = useState(null); // null = loading state
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const checkAccess = async () => {
      // 1. Not Logged In -> Deny
      if (!userInfo) {
        setIsAllowed(false);
        return;
      }

      // 2. ✅ ADMIN BYPASS (Critical Fix)
      // Normalize role to lowercase to catch 'Admin', 'admin', 'Administrator'
      const userRole = userInfo.role ? userInfo.role.toLowerCase() : '';
      
      if (userRole === 'admin' || userRole === 'administrator') {
        // Admins are ALWAYS allowed, regardless of maintenance mode
        setIsAllowed(true);
        return;
      }

      // 3. Citizen -> Check Maintenance Status from Backend
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/settings', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });

        if (data.maintenanceMode) {
          // If maintenance is ON for citizens -> Redirect to Maintenance Page
          setIsAllowed('MAINTENANCE'); 
        } else {
          // If maintenance is OFF -> Allow access
          setIsAllowed(true);
        }
      } catch (error) {
        console.error("Auth Check Error:", error);
        // Fail-safe: If API fails, allow access so we don't lock out users unnecessarily 
        // (The backend middleware will still block them if it's truly critical)
        setIsAllowed(true); 
      }
    };

    checkAccess();
  }, []);

  // --- RENDER LOGIC ---

  // 1. Loading Spinner (While checking permissions)
  if (isAllowed === null) {
    return (
      <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:'#050505'}}>
        <FaSpinner className="spin" style={{fontSize:'2rem', color:'#22c55e'}} />
      </div>
    );
  }

  // 2. Maintenance Block -> Redirect to Maintenance Screen
  if (isAllowed === 'MAINTENANCE') {
    return <Navigate to="/maintenance" replace />;
  }

  // 3. Not Logged In -> Redirect to Login
  if (isAllowed === false) {
    return <Navigate to="/login" replace />;
  }

  // 4. Access Granted -> Render the Page
  return <Outlet />;
};

export default ProtectedRoute;