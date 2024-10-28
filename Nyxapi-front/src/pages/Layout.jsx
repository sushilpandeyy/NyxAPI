import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sling as Hamburger } from 'hamburger-react';
import { FiFolder, FiShare, FiHome, FiDollarSign, FiSettings } from 'react-icons/fi';
import { CgLogOut } from "react-icons/cg";
const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [name, setname]=useState("");

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
      // If no session data, redirect to /auth
      navigate('/auth');
    }
    else{
      setname(sessionData.name)
    }
  }, [navigate]); // Add navigate to dependency array


  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user'));
    if (!sessionData) {
      // If no session data, redirect to /auth
      navigate('/auth');
    } else {
      setname(sessionData.name);
    }
  }, [navigate]);


  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
        <div className="flex items-center space-x-4">
          <div className="md:hidden">
            <Hamburger toggled={isSidebarOpen} toggle={toggleSidebar} size={24} />
          </div>
          <h1 className="text-xl font-bold">My Dashboard</h1>
        </div>
        
        {/* Profile dropdown logic */}
        <div
          className="relative flex items-center space-x-4"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {name ? (
            <div className="relative">
              {/* User name and dropdown trigger */}
              <span className="text-sm cursor-pointer">Welcome, {name}</span>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="px-4 py-2 text-sm font-semibold bg-pink-600 rounded hover:bg-pink-700">
              Login
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar and main content */}
        <aside className={`w-64 bg-gray-800 p-6 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <nav className="space-y-4">
            <Link to="/dashboard" className="flex items-center text-white hover:text-gray-300">
              <FiHome className="mr-2" />
              Home
            </Link>
            <Link to="/dashboard/share" className="flex items-center text-white hover:text-gray-300">
              <FiShare className="mr-2" />
              Share
            </Link>
            <Link to="/dashboard/billing" className="flex items-center text-white hover:text-gray-300">
              <FiDollarSign className="mr-2" />
              Payments
            </Link>
            <Link to="/dashboard/settings" className="flex items-center text-white hover:text-gray-300">
              <FiSettings className="mr-2" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center text-white hover:text-gray-300 w-full text-left mt-6"
            >
              <CgLogOut className="mr-2" />
              Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
