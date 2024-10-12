import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sling as Hamburger } from 'hamburger-react'; // Import hamburger-react component

const Layout = () => {
  // State for toggling sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
        {/* Title and Hamburger on the left */}
        <div className="flex items-center space-x-4">
          {/* Hamburger visible on smaller screens */}
          <div className="md:hidden">
            <Hamburger toggled={isSidebarOpen} toggle={toggleSidebar} size={24} />
          </div>
          <h1 className="text-xl font-bold">My Dashboard</h1>
        </div>

        {/* User details or login button on the right */}
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, User</span>
          <button className="px-4 py-2 text-sm font-semibold bg-pink-600 rounded hover:bg-pink-700">
            Login
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`w-64 bg-gray-800 p-6 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          {/* Sidebar Links */}
          <nav className="space-y-4">
            <Link to="/dashboard" className="block px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-600">Projects</Link>
            <Link to="/dashboard/members" className="block px-4 py-2 text-gray-400 hover:text-white">Members</Link>
            <Link to="/dashboard/usage" className="block px-4 py-2 text-gray-400 hover:text-white">Usage</Link>
            <Link to="/dashboard/billing" className="block px-4 py-2 text-gray-400 hover:text-white">Billing</Link>
            <Link to="/dashboard/settings" className="block px-4 py-2 text-gray-400 hover:text-white">Settings</Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-900 text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
