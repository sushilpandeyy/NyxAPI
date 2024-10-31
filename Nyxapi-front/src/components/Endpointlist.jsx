import React, { useState, useEffect } from 'react'; 
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserFriends, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import nyxLogo from '../assets/nyxLogo.webp';
import CollborateModal from './CollborateModal';
import EndpointJsonEditor from './Endpointsjson';
import CopyButton from './Copybutton';
import OpenUrlButton from './Openlink';

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
        const response = await axios.get(`https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/endpoints/${projectIdInt}`);
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
    <div className="w-full max-w-3xl p-8 mx-auto bg-gray-900 rounded-lg shadow-lg">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <img src={nyxLogo} alt="Nyx Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-bold text-white">Endpoints</h1>
        </div>
        <button onClick={toggleModal} className="text-gray-300 hover:text-white">
          <FaUserFriends className="text-2xl" title="Collaborators" />
        </button>
      </header>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <div key={endpoint.endpointid} className="bg-gray-800 rounded-md shadow-md">
            <div className="flex items-center justify-between p-4">
              <Link to={`https://${projectIdInt}.nyxapi.com/${endpoint.Endpoint}`} className="flex-grow font-mono text-sm text-indigo-400">
                https://{projectIdInt}.nyxapi.com/{endpoint.Endpoint}
              </Link>
              <OpenUrlButton url={`https://${projectIdInt}.nyxapi.com/${endpoint.Endpoint}`} />
              <CopyButton url={`https://${projectIdInt}.nyxapi.com/${endpoint.Endpoint}`} />
              <button
                onClick={() => toggleEndpointEditor(endpoint.endpointid)}
                className="flex items-center px-4 py-2 bg-indigo-600 rounded focus:outline-none"
              >
                {expandedEndpoint === endpoint.endpointid ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            {expandedEndpoint === endpoint.endpointid && (
              <div className="p-4">
                <EndpointJsonEditor Projectid={Projectid} endpointId={parseInt(endpoint.endpointid)} initialPayload={endpoint.Payload} />
              </div>
            )}
          </div>
        ))}
      </div>

      {isJsonInputVisible && (
        <div className="p-4 mt-6 bg-gray-800 rounded-md shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-white">New Endpoint</h2>
          {/* Form for new endpoint */}
          <div className="flex justify-end space-x-4">
            <button onClick={toggleJsonInputVisibility} className="px-4 py-2 font-semibold text-white bg-gray-700 rounded hover:bg-gray-600">
              Cancel
            </button>
            <button className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500">
              Save
            </button>
          </div>
        </div>
      )}

      {isModalOpen && <CollborateModal onClose={toggleModal} />}
    </div>
  );
};

export default EndpointList;
