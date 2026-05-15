import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import AdminTopbar from '../admin/AdminTopbar';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if(window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userInfo');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-inter text-gray-100 flex">
      {/* SIDEBAR (Fixed Width) */}
      <AdminSidebar handleLogout={handleLogout} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <AdminTopbar />

        {/* DYNAMIC PAGE CONTENT */}
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;