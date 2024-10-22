import React, { useState, useEffect } from 'react';
import { FaRegSave } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const SavedEndpoints = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null); // State to track which dropdown is open
  const [isEditing, setIsEditing] = useState(null); // Track which JSON field is being edited

  // Fetch saved endpoints from local storage or backend
  useEffect(() => {
    const savedEndpoints = JSON.parse(localStorage.getItem('endpoints')) || [
      { 
        id: 1, 
        name: 'User Authentication', 
        url: '/api/auth', 
        method: 'POST', 
        description: 'Handles user login and authentication.',
        sampleData: `{
  "username": "john_doe",
  "password": "your_password"
}` 
      },
      { 
        id: 2, 
        name: 'Get User Data', 
        url: '/api/user', 
        method: 'GET', 
        description: 'Fetches user profile data.',
        sampleData: `{
  "userId": "12345"
}` 
      },
      { 
        id: 3, 
        name: 'Update User Info', 
        url: '/api/user/update', 
        method: 'PUT', 
        description: 'Updates user information.',
        sampleData: `{
  "userId": "12345",
  "email": "new_email@example.com",
  "name": "John Doe"
}` 
      },
    ];
    setEndpoints(savedEndpoints);
  }, []);

  // Toggle the dropdown for a specific endpoint
  const toggleDropdown = (id) => {
    setActiveDropdown((prevActive) => (prevActive === id ? null : id)); // Toggle the active dropdown
  };

  // Handle click on Edit button for editing sample JSON data
  const handleEditToggle = (id) => {
    setIsEditing((prev) => (prev === id ? null : id)); // Toggle edit mode
  };

  // Handle changes in the JSON input field
  const handleJsonChange = (id, newJson) => {
    const updatedEndpoints = endpoints.map(endpoint => 
      endpoint.id === id ? { ...endpoint, sampleData: newJson } : endpoint
    );
    setEndpoints(updatedEndpoints);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="relative p-1 bg-transparent rounded-lg shadow-lg">
        <div className="absolute inset-0 "></div>
        <div className="relative grid w-full max-w-5xl p-10 mx-4 bg-gray-800 border border-transparent rounded-lg bg-opacity-60 backdrop-blur-lg">
          <h1 className="mb-8 text-3xl font-semibold text-center text-white">
            Saved API Endpoints
          </h1>

          <div className="w-full max-w-4xl space-y-4">
            {endpoints.length > 0 ? (
              endpoints.map((endpoint) => (
                <div
                  key={endpoint.id}
                  className="p-4 bg-gray-700 rounded-md shadow-md bg-opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleDropdown(endpoint.id)}
                        className="px-2 py-1 text-gray-400 hover:text-white"
                      >
                        {activeDropdown === endpoint.id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      
                      <button className="flex items-center p-2 text-white transition duration-300 bg-pink-600 rounded-md hover:bg-pink-700">
                        <FaRegSave className="text-lg" />
                        <span className="sr-only">Save</span> {/* Screen reader only text */}
                      </button>

                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          {endpoint.name}
                        </h2>
                        <p className="text-sm text-gray-300">URL: {endpoint.url}</p>
                        <p className="text-sm text-gray-400">Method: {endpoint.method}</p>
                      </div>
                    </div>
                  </div>

                  {activeDropdown === endpoint.id && (
                    <div className="p-4 mt-4 text-gray-300 bg-gray-600 rounded-lg">
                      <p>{endpoint.description}</p>

                      <div className="mt-4">
                        <h3 className="mb-2 font-semibold text-white">Sample JSON Input:</h3>
                        
                        <button
                          onClick={() => handleEditToggle(endpoint.id)}
                          className="p-1 mb-2 text-white transition duration-300 bg-pink-600 rounded-md hover:bg-pink-700"
                        >
                          <CiEdit className="text-lg" />
                          <span className="sr-only">{isEditing === endpoint.id ? 'Stop Editing' : 'Edit'}</span>
                        </button>
                        
                        <textarea
                          className="w-full p-3 text-gray-200 transition duration-300 bg-black border-2 border-pink-400 rounded-lg" // Changed to bg-black
                          rows="6"
                          value={endpoint.sampleData}
                          onChange={(e) => handleJsonChange(endpoint.id, e.target.value)}
                          readOnly={isEditing !== endpoint.id} // Only editable when isEditing is true
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No saved endpoints.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedEndpoints;
