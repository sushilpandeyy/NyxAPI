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
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo with custom font */}
          <div className="flex items-center flex-shrink-0">
            <h1 className={`text-3xl font-bold roboto-flex-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              NyxAPI
            </h1>
          </div>
          
          {/* Right: Navigation Links */}
          <div className="items-center hidden space-x-8 md:flex">
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
          <div onClick={toggleTheme} className="flex gap-4 cursor-pointer">
            <h2 className='p-1 text-center text-m'>Theme :</h2>
            {isDarkMode ? (
              <FaToggleOn className="text-4xl text-white" />
            ) : (
              <FaToggleOff className="text-4xl text-gray-800" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
