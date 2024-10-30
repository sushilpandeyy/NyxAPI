import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-semibold text-center text-white">Settings</h1>

        {/* Profile Details */}
        <div className="p-4 mb-8 bg-gray-700 rounded-md shadow-md">
          <h2 className="text-xl font-semibold text-gray-200">Profile</h2>
          <p className="mt-2 text-gray-400">
            <strong>Name:</strong> {user?.name || 'N/A'}
          </p>
          <p className="mt-2 text-gray-400">
            <strong>Email:</strong> {user?.email || 'N/A'}
          </p>
        </div>

        {/* Logout Container */}
        <div className="p-4 bg-gray-700 rounded-md shadow-md">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
