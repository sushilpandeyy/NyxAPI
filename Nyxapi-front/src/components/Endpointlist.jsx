// EndpointList.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserFriends, FaEllipsisV } from 'react-icons/fa';
import nyxLogo from '../assets/nyxLogo.webp';
import CollborateModal from './CollborateModal';

const EndpointList = () => {
  const { Projectid } = useParams();
  const [endpoints, setEndpoints] = useState([]);
  const [endpoint, setEndpoint] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [isJsonInputVisible, setIsJsonInputVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const projectIdInt = parseInt(Projectid, 10);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleJsonInputVisibility = () => setIsJsonInputVisible(!isJsonInputVisible);

  useEffect(() => {
    const fetchEndpointData = async () => {
      try {
        const response = await axios.get(`http://52.66.241.159/endpoints/${projectIdInt}`);
        console.log(response.data)
        setEndpoints(response.data.endpoint_info);
      } catch (err) {
        setError('Failed to load endpoint information.');
      }
    };

    fetchEndpointData();
  }, [projectIdInt]);

  const handleSaveJsonData = async () => {
    try {
      const parsedJson = JSON.parse(jsonData);
      const payload = {
        Endpoint: endpoint,
        Projectid: projectIdInt,
        Apitype: 'GET',
        Payload: JSON.stringify(parsedJson),
      };
      await axios.post('http://52.66.241.159/endpoints/', payload);
      alert('Endpoint created successfully');
      setEndpoint('');
      setJsonData('');
    } catch (error) {
      setError('Failed to create endpoint. Ensure the JSON data is valid.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <img src={nyxLogo} alt="Nyx Logo" className="h-10 w-10" />
          <h1 className="text-3xl font-bold text-white">Endpoints</h1>
        </div>
        <button onClick={toggleModal} className="text-gray-300 hover:text-white">
          <FaUserFriends className="text-2xl" title="Collaborators" />
        </button>
      </header>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <div key={endpoint.id} className="flex justify-between items-center p-4 bg-gray-700 rounded-md shadow-md">
            <Link to={`http://${projectIdInt}.localhost:3001/${endpoint.Endpoint}`} className="text-blue-400 font-mono text-sm flex-grow">
              http://{projectIdInt}.localhost:3001/{endpoint.Endpoint}
            </Link>
            <FaEllipsisV className="text-gray-400 hover:text-white cursor-pointer" />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={toggleJsonInputVisibility}
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          {isJsonInputVisible ? 'Hide JSON Input' : 'Add New Endpoint'}
        </button>
      </div>

      {isJsonInputVisible && (
        <div className="mt-6 bg-gray-700 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">New Endpoint</h2>
          <div className="flex items-center mb-4">
            <span className="inline-block p-2 font-mono text-sm text-blue-800 bg-blue-100 rounded-l">
              http://{projectIdInt}.nyxapi.com/
            </span>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="Enter endpoint path"
              className="flex-grow p-2 font-mono text-sm text-blue-800 bg-white rounded-r focus:outline-none"
            />
          </div>

          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="Enter JSON data"
            rows="6"
            className="w-full p-3 text-gray-800 bg-white rounded focus:outline-none mb-4"
          />

          <button
            onClick={handleSaveJsonData}
            className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
          >
            Save Endpoint
          </button>
        </div>
      )}

      {isModalOpen && <CollborateModal onClose={toggleModal} />}
    </div>
  );
};

export default EndpointList;
