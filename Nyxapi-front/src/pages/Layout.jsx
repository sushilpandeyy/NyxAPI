import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sling as Hamburger } from 'hamburger-react';
import { FiFolder, FiShare, FiHome, FiDollarSign, FiSettings } from 'react-icons/fi';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
        <div className="flex items-center space-x-4">
          <div className="md:hidden">
            <Hamburger toggled={isSidebarOpen} toggle={toggleSidebar} size={24} />
          </div>
          <h1 className="text-xl font-bold">My Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, User</span>
          <button className="px-4 py-2 text-sm font-semibold bg-pink-600 rounded hover:bg-pink-700">
            Login
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className={`w-64 bg-gray-800 p-6 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <nav className="space-y-4">
            <Link to="/dashboard" className="flex items-center px-4 py-2 text-white rounded hover:bg-gray-600">
              <FiFolder className="mr-2" />
              My Projects
            </Link>
            <Link to="/dashboard/shared" className="flex items-center px-4 py-2 text-white rounded hover:bg-gray-600">
              <FiShare className="mr-2" />
              Shared with Me
            </Link>
            <Link to="/usage" className="flex items-center px-4 py-2 text-white rounded hover:bg-gray-600">
              <FiHome className="mr-2" />
              Usage
            </Link>
            <Link to="/billing" className="flex items-center px-4 py-2 text-white rounded hover:bg-gray-600">
              <FiDollarSign className="mr-2" />
              Billing
            </Link>
            <Link to="/settings" className="flex items-center px-4 py-2 text-white rounded hover:bg-gray-600">
              <FiSettings className="mr-2" />
              Settings
            </Link>
          </nav>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
