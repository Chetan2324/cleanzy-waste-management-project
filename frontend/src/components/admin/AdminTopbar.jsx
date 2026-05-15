import React from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';

const AdminTopbar = () => {
  // Mock Admin Data (Replace with real context later)
  const adminInfo = JSON.parse(localStorage.getItem('userInfo')) || { name: 'Admin User', email: 'admin@cleanzy.com' };

  return (
    <header className="h-16 bg-[#09090b]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40 px-8 flex items-center justify-between ml-64">
      {/* SEARCH BAR (Visual Only) */}
      <div className="relative hidden md:block w-96">
        <FaSearch className="absolute left-3 top-3 text-gray-500 text-sm" />
        <input 
          type="text" 
          placeholder="Search everywhere..." 
          className="w-full bg-[#18181b] border border-gray-700 text-gray-300 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-green-500/50 transition-colors"
        />
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-gray-400 hover:text-white transition">
          <FaBell className="text-lg" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#09090b]"></span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-800">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-white">{adminInfo.name}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-emerald-700 p-[2px]">
            <div className="w-full h-full rounded-full bg-[#18181b] flex items-center justify-center text-green-500 font-bold">
              {adminInfo.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;