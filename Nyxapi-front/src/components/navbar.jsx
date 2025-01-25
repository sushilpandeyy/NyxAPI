import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="px-3 py-2 text-lg transition-colors hover:bg-gray-700 rounded-md">
        Home
      </Link>
      <Link to="/features" className="px-3 py-2 text-lg transition-colors hover:bg-gray-700 rounded-md">
        Features
      </Link>
      <Link to="/about" className="px-3 py-2 text-lg transition-colors hover:bg-gray-700 rounded-md">
        About
      </Link>
      <Link to="/login" className="px-3 py-2 text-lg transition-colors hover:bg-gray-700 rounded-md">
        Login
      </Link>
    </>
  );

  return (
    <nav className="bg-gray-900 text-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-3xl font-bold">NyxAPI</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4 mr-4">
              <NavLinks />
            </div>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleDarkMode}
              className="mr-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLinks />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;