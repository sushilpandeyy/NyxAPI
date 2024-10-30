import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CollborateModal from './CollborateModal';

const CreateEndpoint = () => {
  const { Projectid } = useParams();
  const [endpoint, setEndpoint] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fullUrl = `http://${Projectid}.nyxapi.com/${endpoint}`;

  const handleCreateEndpoint = async () => {
    const payload = {
      Endpoint: endpoint,
      Projectid: parseInt(Projectid, 10),
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
    <div className="w-full max-w-3xl p-8 mb-8 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold text-white">Create New Endpoint</h2>
      
      <div className="flex items-center mb-4">
        <span className="inline-block p-2 font-mono text-sm text-blue-300 bg-gray-800 rounded-l whitespace-nowrap">
          {`http://${Projectid}.nyxapi.com/`}
        </span>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="Enter endpoint path"
          className="w-full p-2 font-mono text-sm text-blue-300 bg-gray-800 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCreateEndpoint}
          className="px-4 py-2 text-white transition duration-200 ease-in-out bg-indigo-600 rounded hover:bg-indigo-700 hover:bg-opacity-90"
        >
          Create Endpoint
        </button>
        <button
          onClick={toggleModal}
          className="px-4 py-2 text-white transition duration-200 ease-in-out bg-gray-700 rounded hover:bg-gray-600 hover:bg-opacity-90"
        >
          Collaborate
        </button>
      </div>
      
      {isModalOpen && <CollborateModal toggleModal={toggleModal} />}
    </div>
  );
};

export default CreateEndpoint;
