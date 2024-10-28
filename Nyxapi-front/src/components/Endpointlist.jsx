import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserFriends, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import nyxLogo from '../assets/nyxLogo.webp';
import CollborateModal from './CollborateModal';
import EndpointJsonEditor from './Endpointsjson';

const EndpointList = () => {
  const { Projectid } = useParams();
  const [endpoints, setEndpoints] = useState([]);
  const [isJsonInputVisible, setIsJsonInputVisible] = useState(false);
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const projectIdInt = parseInt(Projectid, 10);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleJsonInputVisibility = () => setIsJsonInputVisible(!isJsonInputVisible);

  useEffect(() => {
    const fetchEndpointData = async () => {
      try {
        const response = await axios.get(`http://52.66.241.159/endpoints/${projectIdInt}`);
        setEndpoints(response.data.endpoint_info);
        console.log(response.data);
      } catch (err) {
        setError('Failed to load endpoint information.');
      }
    };

    fetchEndpointData();
  }, [projectIdInt]);

  const toggleEndpointEditor = (endpointId) => {
    setExpandedEndpoint(expandedEndpoint === endpointId ? null : endpointId);
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
          <div key={endpoint.endpointid} className="bg-gray-700 rounded-md shadow-md">
            <div className="flex justify-between items-center p-4">
              <Link to={`http://${projectIdInt}.localhost:3001/${endpoint.Endpoint}`} className="text-blue-400 font-mono text-sm flex-grow">
                http://{projectIdInt}.localhost:3001/{endpoint.Endpoint}
              </Link>
              <button
                onClick={() => toggleEndpointEditor(endpoint.id)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                {expandedEndpoint === endpoint.id ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            {expandedEndpoint === endpoint.id && (
              <div className="p-4">
                <EndpointJsonEditor Projectid={Projectid} endpointId={parseInt(endpoint.endpointid)} initialPayload={endpoint.Payload} />
              </div>
            )}
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
          {/* Form for new endpoint (as in original code) */}
        </div>
      )}

      {isModalOpen && <CollborateModal onClose={toggleModal} />}
    </div>
  );
};

export default EndpointList;
