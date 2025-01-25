import React, { useState, useEffect } from 'react';
import { FaRegSave, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

const SavedEndpoints = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    const savedEndpoints = JSON.parse(localStorage.getItem('endpoints')) || [
      { 
        id: 1, 
        name: 'User Authentication', 
        url: '/api/auth', 
        method: 'POST', 
        description: 'Handles user login and authentication.',
        sampleData: JSON.stringify({
          username: "john_doe",
          password: "your_password"
        }, null, 2)
      },
      { 
        id: 2, 
        name: 'Get User Data', 
        url: '/api/user', 
        method: 'GET', 
        description: 'Fetches user profile data.',
        sampleData: JSON.stringify({
          userId: "12345"
        }, null, 2)
      },
      { 
        id: 3, 
        name: 'Update User Info', 
        url: '/api/user/update', 
        method: 'PUT', 
        description: 'Updates user information.',
        sampleData: JSON.stringify({
          userId: "12345",
          email: "new_email@example.com",
          name: "John Doe"
        }, null, 2)
      },
    ];
    setEndpoints(savedEndpoints);
  }, []);

  const toggleDropdown = (id) => {
    setActiveDropdown((prevActive) => (prevActive === id ? null : id));
  };

  const handleEditToggle = (id) => {
    setIsEditing((prev) => (prev === id ? null : id));
  };

  const handleJsonChange = (id, newJson) => {
    try {
      // Validate JSON before updating
      JSON.parse(newJson);
      const updatedEndpoints = endpoints.map(endpoint => 
        endpoint.id === id ? { ...endpoint, sampleData: newJson } : endpoint
      );
      setEndpoints(updatedEndpoints);
    } catch (error) {
      // Optional: Add error handling for invalid JSON
      console.error('Invalid JSON input');
    }
  };

  const handleSaveEndpoint = (id) => {
    const endpointToSave = endpoints.find(ep => ep.id === id);
    // Implement save logic (e.g., to backend or local storage)
    console.log('Saving endpoint:', endpointToSave);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Saved API Endpoints
        </h1>

        <div className="space-y-4">
          {endpoints.length > 0 ? (
            endpoints.map((endpoint) => (
              <div 
                key={endpoint.id} 
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleDropdown(endpoint.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {activeDropdown === endpoint.id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    
                    <button 
                      onClick={() => handleSaveEndpoint(endpoint.id)}
                      className="text-white bg-indigo-600 p-2 rounded-md hover:bg-indigo-700"
                    >
                      <FaRegSave />
                    </button>

                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {endpoint.name}
                      </h2>
                      <p className="text-sm text-gray-300">
                        URL: {endpoint.url} | Method: {endpoint.method}
                      </p>
                    </div>
                  </div>
                </div>

                {activeDropdown === endpoint.id && (
                  <div className="p-4 bg-gray-700">
                    <p className="text-gray-300 mb-4">{endpoint.description}</p>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-white">Sample JSON Input:</h3>
                        <button
                          onClick={() => handleEditToggle(endpoint.id)}
                          className="text-white bg-indigo-600 p-2 rounded-md hover:bg-indigo-700"
                        >
                          <CiEdit />
                        </button>
                      </div>
                      
                      <textarea
                        className="w-full p-3 bg-gray-800 text-white rounded-lg font-mono"
                        rows="6"
                        value={endpoint.sampleData}
                        onChange={(e) => handleJsonChange(endpoint.id, e.target.value)}
                        readOnly={isEditing !== endpoint.id}
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
  );
};

export default SavedEndpoints;