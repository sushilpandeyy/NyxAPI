import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <nav className={`bg-gray-900 text-white`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-shrink-0">
            <h1 className={`text-3xl font-bold roboto-flex-bold`}>
              NyxAPI
            </h1>
          </div>

          <div className="items-center hidden space-x-8 md:flex">
            <a href="/" className={`px-3 py-2 rounded-md text-lg roboto-flex-regular `}>
              Home
            </a>
            <a href="/about" className={`px-3 py-2 rounded-md text-lg roboto-flex-regular `}>
              Features
            </a>
            <a href="/services" className={`px-3 py-2 rounded-md text-lg roboto-flex-regular `}>
              About
            </a>
            <a href="/contact" className={`px-3 py-2 rounded-md text-lg roboto-flex-regular `}>
              Contact
            </a>
          </div>          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;