import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserFriends, FaEllipsisV } from 'react-icons/fa';
import nyxLogo from '../assets/nyxLogo.webp';

const EndpointSection = () => {
  const { Projectid } = useParams(); // Retrieve 'Projectid' from the URL
  const [endpoint, setEndpoint] = useState('placetentertext'); // State to manage editable endpoint
  const [isJsonInputVisible, setIsJsonInputVisible] = useState(false); // State to manage visibility of JSON input
  const [jsonData, setJsonData] = useState(''); // State to store the entered JSON data
  const [error, setError] = useState('');

  // Convert Projectid to an integer
  const projectIdInt = parseInt(Projectid, 10); // Parse Projectid as an integer

  // Check if projectIdInt is valid
  if (isNaN(projectIdInt)) {
    console.error('Invalid Projectid, expected an integer.');
  }

  // Handle endpoint input changes
  const handleEndpointChange = (e) => {
    setEndpoint(e.target.value); // Update the endpoint path
  };

  // Handle JSON data input changes
  const handleJsonChange = (e) => {
    setJsonData(e.target.value); // Update the JSON data
  };

  // Toggle the visibility of the JSON input box
  const toggleJsonInputVisibility = () => {
    setIsJsonInputVisible(!isJsonInputVisible); // Show/hide the JSON input box
  };

  // Handle the save operation for JSON data and send POST request
  const handleSaveJsonData = async () => {
    try {
      // Validate and parse the JSON input
      const parsedJson = JSON.parse(jsonData); // Validate JSON data

      // Prepare the payload for the POST request
      const payload = {
        Endpoint: endpoint,          // From the input field
        Projectid: projectIdInt,     // From URL params
        Apitype: "GET",              // Fixed API type
        Payload: JSON.stringify(parsedJson) // JSON payload as string
      };

      // Send POST request to /endpoints/
      const response = await axios.post('http://localhost:8000/endpoints/', payload);

      if (response.status === 200) {
        console.log('Endpoint created successfully:', response.data);
        alert('Endpoint created successfully');
      }
    } catch (error) {
      console.error('Error creating endpoint:', error);
      setError('Failed to create endpoint. Ensure the JSON data is valid.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-16 text-white bg-gray-900">
      <div className="flex items-center justify-between w-full max-w-3xl mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">
            Projects / 
          </h1>
          <img 
            src={nyxLogo} 
            alt="NyxAPI Logo" 
            className="w-8 h-8 mx-2"
          />
          <span className="text-3xl font-bold text-pink-600">NyxAPI</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <FaUserFriends className="text-xl text-gray-400 cursor-pointer hover:text-white" title="Collaborators" />
          <FaEllipsisV className="text-xl text-gray-400 cursor-pointer hover:text-white" title="More options" />
        </div>
      </div>

      <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg">
        <h2 className="mb-4 text-2xl font-bold text-white">API endpoint</h2>
        
        {/* Flex container to keep the span and input on the same line */}
        <div className="flex items-center mb-4">
          {/* Static and uneditable part of the URL */}
          <Link to={`http://${projectIdInt}.nyxapi.com/${endpoint}`}>
            <span className="inline-block p-2 font-mono text-sm text-blue-800 bg-blue-100 rounded-l whitespace-nowrap">
              http://{projectIdInt}.nyxapi.com/
            </span>
          </Link>

          {/* Editable part of the URL */}
          <input
            type="text"
            value={endpoint}
            onChange={handleEndpointChange}
            className="w-full p-2 font-mono text-sm text-blue-800 bg-white rounded-r focus:outline-none flex-grow"
            placeholder="enter-endpoint-path"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={toggleJsonInputVisibility}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            New resource
          </button>
          <button className="px-4 py-2 text-gray-200 bg-gray-700 rounded hover:bg-gray-600">
            Generate all
          </button>
          <button className="px-4 py-2 text-gray-200 bg-gray-700 rounded hover:bg-gray-600">
            Reset all
          </button>
        </div>

        {/* Show input box for JSON data and save button */}
        {isJsonInputVisible && (
          <div className="mt-6">
            <h3 className="mb-2 text-xl font-semibold text-white">Enter JSON Data:</h3>
            <textarea
              value={jsonData}
              onChange={handleJsonChange}
              placeholder="Enter your JSON data here"
              rows="6"
              className="w-full p-4 font-mono text-sm text-gray-900 bg-white rounded-lg focus:outline-none"
            />
            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
            <button
              onClick={handleSaveJsonData}
              className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400">🔍 No resources yet...</p>
        </div>
      </div>
    </div>
  );
};

const EndpointScreen = () => {
  return (
    <>
      <EndpointSection />
    </>
  );
};

export default EndpointScreen;
