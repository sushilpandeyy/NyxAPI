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
  const [endpoint, setEndpoint] = useState('enter-endpoint-path');
  const [jsonData, setJsonData] = useState('');
  const [isJsonInputVisible, setIsJsonInputVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  
  const projectIdInt = parseInt(Projectid, 10);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchEndpointData = async () => {
      try {
        const response = await axios.get(`http://52.66.241.159/endpoints/${projectIdInt}`);
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
        Apitype: "GET",
        Payload: JSON.stringify(parsedJson),
      };
      await axios.post('http://52.66.241.159/endpoints/', payload);
      alert('Endpoint created successfully');
    } catch (error) {
      setError('Failed to create endpoint. Ensure the JSON data is valid.');
    }
  };

  return (
    <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">API Endpoints</h2>
        <div className="flex items-center space-x-4">
          <FaUserFriends onClick={toggleModal} className="cursor-pointer hover:text-white" />
          <FaEllipsisV className="cursor-pointer hover:text-white" />
        </div>
      </div>

      <div className="flex items-center mb-4">
        <Link to={`http://${projectIdInt}.localhost:8001/${endpoint}`}>
          <span className="inline-block p-2 bg-blue-100 text-blue-800 rounded-l">http://{projectIdInt}.nyxapi.com/</span>
        </Link>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="w-full p-2 bg-white text-blue-800 rounded-r"
          placeholder="Enter endpoint path"
        />
      </div>

      <button onClick={() => setIsJsonInputVisible(!isJsonInputVisible)} className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2">
        New Resource
      </button>

      {isJsonInputVisible && (
        <div className="mt-4">
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="Enter JSON data"
            rows="6"
            className="w-full p-4 bg-gray-900 text-white rounded-lg"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button onClick={handleSaveJsonData} className="bg-green-600 hover:bg-green-700 text-white rounded p-2 mt-2">
            Save
          </button>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white">Endpoints:</h3>
        <ul>
          {endpoints.map((endpoint) => (
            <li key={endpoint.id} className="flex justify-between p-2 bg-gray-700 rounded-lg mt-2">
              <span className="text-blue-800">http://{projectIdInt}.nyxapi.com/{endpoint.Endpoint}</span>
              <span className="text-gray-400">{endpoint.Payload}</span>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && <CollborateModal toggleModal={toggleModal} />}
    </div>
  );
};

export default EndpointList;
