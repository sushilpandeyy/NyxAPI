// CreateEndpoint.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CollborateModal from './CollborateModal';

const CreateEndpoint = () => {
  const { Projectid } = useParams(); // Retrieve Projectid from URL
  const [endpoint, setEndpoint] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Construct the full URL with the subdomain
  const fullUrl = `http://${Projectid}.nyxapi.com/${endpoint}`;

  const handleCreateEndpoint = async () => {
    const payload = {
      Endpoint: endpoint,
      Projectid: parseInt(Projectid, 10), // Ensure Projectid is an integer
      Apitype: 'GET',
      Payload: JSON.stringify({})
    };

    try {
      await axios.post('https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/endpoints/', payload);
      alert('Endpoint created successfully');
      setEndpoint('');
    } catch (error) {
      console.error('Error creating endpoint:', error);
      alert('Failed to create endpoint');
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="w-full max-w-3xl p-8 mb-8 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Create New Endpoint</h2>
      
      {/* Display the dynamic full URL */}
      <div className="flex items-center mb-4">
        <span className="inline-block p-2 font-mono text-sm text-blue-800 bg-blue-100 rounded-l whitespace-nowrap">
          {`http://${Projectid}.nyxapi.com/`}
        </span>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="Enter endpoint path"
          className="w-full p-2 font-mono text-sm text-blue-800 bg-white rounded-r focus:outline-none flex-grow"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCreateEndpoint}
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-blue-700"
        >
          Create Endpoint
        </button>
        <button
          onClick={toggleModal}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Collaborate
        </button>
      </div>
      
      {isModalOpen && <CollborateModal toggleModal={toggleModal} />}
    </div>
  );
};

export default CreateEndpoint;
