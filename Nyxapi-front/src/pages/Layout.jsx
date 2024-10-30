import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FiHome, FiShare2, FiBell, FiSettings } from 'react-icons/fi';
import { MdOutlineSubscriptions } from 'react-icons/md';
import { CgLogOut } from "react-icons/cg";
import { BsFillChatDotsFill } from 'react-icons/bs';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();  // Clear all session data
    navigate('/auth');  // Redirect to login page
  };

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user'));
    if (!sessionData) {
      navigate('/auth');
    } else {
      setName(sessionData.name);
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen text-white bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 p-6 bg-gray-800 bg-opacity-90 backdrop-blur-lg shadow-lg transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex flex-col h-full space-y-8">
          {/* Logo */}
          <div className="flex items-center mb-8 space-x-2">
            <div className="p-2 bg-blue-500 rounded-full">
              {/* Placeholder Logo Icon */}
              <BsFillChatDotsFill size={24} />
            </div>
            <h1 className="text-xl font-semibold">NyxAPI</h1>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4">
            <Link to="/dashboard" className="flex items-center px-4 py-3 transition-all bg-gray-700 rounded-lg hover:bg-gray-600">
              <FiHome className="mr-3 text-blue-400" />
              <span className="text-sm">Home</span>
            </Link>
            <Link to="/share" className="flex items-center px-4 py-3 transition-all rounded-lg hover:bg-gray-600">
              <FiShare2 className="mr-3 text-green-400" />
              <span className="text-sm">Share</span>
            </Link>
            <Link to="/billing" className="flex items-center px-4 py-3 transition-all rounded-lg hover:bg-gray-600">
              <MdOutlineSubscriptions className="mr-3 text-purple-400" />
              <span className="text-sm">Manage Subscription</span>
            </Link>
            <Link to="/updates" className="flex items-center px-4 py-3 transition-all rounded-lg hover:bg-gray-600">
              <FiBell className="mr-3 text-orange-400" />
              <span className="text-sm">Updates & FAQ</span>
            </Link>
            <Link to="/settings" className="flex items-center px-4 py-3 transition-all rounded-lg hover:bg-gray-600">
              <FiSettings className="mr-3 text-pink-400" />
              <span className="text-sm">Settings</span>
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-300 transition-all rounded-lg hover:bg-gray-700"
            >
              <CgLogOut className="mr-3 text-red-500" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-0 text-white bg-gray-900 rounded-lg shadow-lg md:ml-64 bg-opacity-80">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
