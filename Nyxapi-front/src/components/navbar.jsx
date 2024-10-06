import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('bg-gray-900', 'text-white');
      document.body.classList.remove('bg-white', 'text-black');
    } else {
      document.body.classList.add('bg-white', 'text-black');
      document.body.classList.remove('bg-gray-900', 'text-white');
    }
  }, [isDarkMode]);

  return (
    <nav className={`bg-gray-800 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo with custom font */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className={`text-3xl font-bold roboto-flex-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              NyxAPi
            </h1>
          </div>
          
          {/* Right: Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="/" className={`px-3 py-2 rounded-md text-lg roboto-flex-regular ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'}`}>
              Home
            </a>
            <a href="/about" className={`px-3 py-2 rounded-md text-lg roboto-flex-regular ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'}`}>
              Features
            </a>
            <a href="/services" className={`px-3 py-2 rounded-md text-lg roboto-flex-regular ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'}`}>
              About
            </a>
            <a href="/contact" className={`px-3 py-2 rounded-md text-lg roboto-flex-regular ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'}`}>
              Contact
            </a>
          </div>

          {/* Toggle Theme Icon */}
          <div onClick={toggleTheme} className="cursor-pointer flex gap-4">
            <h2 className='text-center p-1 text-m'>Theme :</h2>
            {isDarkMode ? (
              <FaToggleOn className="text-white text-4xl" />
            ) : (
              <FaToggleOff className="text-gray-800 text-4xl" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
