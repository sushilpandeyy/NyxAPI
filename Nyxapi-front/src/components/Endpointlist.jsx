import React, { useState, useEffect } from 'react'; 
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Copy, 
  Code, 
  Globe,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import CollborateModal from './CollborateModal';
import EndpointJsonEditor from './Endpointsjson';
import ConfirmationModal from './ConfirmationModal';
import { API_ENDPOINTS } from '../config/api';

const EndpointList = () => {
  const { Projectid } = useParams();
  const [endpoints, setEndpoints] = useState([]);
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, endpoint: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const projectIdInt = parseInt(Projectid, 10);

  const httpMethodColors = {
    GET: 'bg-success-100 text-success-800 border-success-200',
    POST: 'bg-primary-100 text-primary-800 border-primary-200',
    PUT: 'bg-warning-100 text-warning-800 border-warning-200',
    DELETE: 'bg-error-100 text-error-800 border-error-200',
    PATCH: 'bg-primary-200 text-primary-900 border-primary-300',
    HEAD: 'bg-dark-200 text-dark-800 border-dark-300',
    OPTIONS: 'bg-dark-300 text-dark-900 border-dark-400'
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    const fetchEndpointData = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_ENDPOINTS.ENDPOINTS}/${projectIdInt}`);
        setEndpoints(response.data.endpoint_info);
        console.log('Endpoints loaded:', response.data);
      } catch (err) {
        console.error('Failed to load endpoints:', err);
        setError('Failed to load endpoint information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEndpointData();
  }, [projectIdInt]);

  const toggleEndpointEditor = (endpointId) => {
    setExpandedEndpoint(expandedEndpoint === endpointId ? null : endpointId);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showNotification('URL copied to clipboard!');
  };

  const handleDeleteEndpoint = (endpoint, e) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, endpoint });
  };

  const confirmDeleteEndpoint = async () => {
    if (!deleteModal.endpoint) return;
    
    try {
      setIsDeleting(true);
      setError('');
      
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await axios.delete(
        `${API_ENDPOINTS.ENDPOINTS}/${deleteModal.endpoint.endpointid}?user_id=${user.user_id}`
      );
      
      if (response.status === 200) {
        // Remove the endpoint from the local state
        setEndpoints(endpoints.filter(e => e.endpointid !== deleteModal.endpoint.endpointid));
        setDeleteModal({ isOpen: false, endpoint: null });
        showNotification('Endpoint deleted successfully!');
        
        // Close expanded view if it was the deleted endpoint
        if (expandedEndpoint === deleteModal.endpoint.endpointid) {
          setExpandedEndpoint(null);
        }
      }
    } catch (err) {
      console.error('Error deleting endpoint:', err);
      setError(err.response?.data?.detail || 'Failed to delete endpoint. Please try again.');
      showNotification('Failed to delete endpoint', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({ isOpen: false, endpoint: null });
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-dark-900 rounded-xl p-8 shadow-xl border border-dark-700">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-primary-300">Loading endpoints...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-strong flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'status-success' 
            : 'status-error'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">API Endpoints</h1>
                <p className="text-primary-100">
                  {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''} configured for Project #{projectIdInt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {endpoints.filter(e => e.Working).length} Active
                </span>
              </div>
              <button
                onClick={toggleModal}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
              >
                <Users size={18} />
                <span className="font-medium">Collaborate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-dark-900 rounded-b-xl shadow-xl border border-dark-700">
          {error && (
            <div className="p-6 border-b border-dark-700">
              <div className="flex items-center gap-3 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            </div>
          )}

          {endpoints.length === 0 && !error ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 p-4 bg-dark-800 rounded-full">
                <Code className="w-8 h-8 text-dark-500" />
              </div>
              <h3 className="text-xl font-semibold text-dark-300 mb-2">No Endpoints Yet</h3>
              <p className="text-dark-500">Create your first API endpoint to get started.</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {endpoints.map((endpoint) => (
                <div key={endpoint.endpointid} className="bg-dark-800/50 rounded-lg border border-dark-600 overflow-hidden hover:border-dark-500 transition-colors">
                  {/* Endpoint Header */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {/* HTTP Method Badges */}
                            {Array.isArray(endpoint.Apitype) ? (
                              endpoint.Apitype.map((method) => (
                                <span
                                  key={method}
                                  className={`px-2 py-1 text-xs font-semibold rounded border ${httpMethodColors[method] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
                                >
                                  {method}
                                </span>
                              ))
                            ) : (
                              <span className={`px-2 py-1 text-xs font-semibold rounded border ${httpMethodColors[endpoint.Apitype] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                {endpoint.Apitype}
                              </span>
                            )}
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            endpoint.Working 
                              ? 'bg-success-900/50 text-success-400' 
                              : 'bg-error-900/50 text-error-400'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${endpoint.Working ? 'bg-success-400' : 'bg-error-400'}`}></div>
                            {endpoint.Working ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        
                        <div className="font-mono text-sm text-primary-400 mb-2 break-all">
                          http://{projectIdInt}.localhost:8000/{endpoint.Endpoint}
                        </div>
                        
                        {endpoint.Created && (
                          <div className="flex items-center gap-1 text-xs text-dark-400">
                            <Clock size={12} />
                            <span>Created {formatTimestamp(endpoint.Created)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleCopyUrl(`http://${projectIdInt}.localhost:8000/${endpoint.Endpoint}`)}
                          className="p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700 rounded-lg transition-colors"
                          title="Copy URL"
                        >
                          <Copy size={16} />
                        </button>
                        <a
                          href={`http://${projectIdInt}.localhost:8000/${endpoint.Endpoint}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700 rounded-lg transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={(e) => handleDeleteEndpoint(endpoint, e)}
                          className="p-2 text-dark-400 hover:text-error-400 hover:bg-dark-700 rounded-lg transition-colors"
                          title="Delete endpoint"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => toggleEndpointEditor(endpoint.endpointid)}
                          className={`flex items-center gap-1 px-3 py-2 font-medium text-sm rounded-lg transition-all duration-200 ${
                            expandedEndpoint === endpoint.endpointid
                              ? 'bg-primary-600 text-white'
                              : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                          }`}
                        >
                          <Settings size={14} />
                          <span>Configure</span>
                          {expandedEndpoint === endpoint.endpointid ? 
                            <ChevronUp size={14} /> : 
                            <ChevronDown size={14} />
                          }
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable JSON Editor */}
                  {expandedEndpoint === endpoint.endpointid && (
                    <div className="border-t border-dark-600 bg-dark-900/50">
                      <div className="p-5">
                        <EndpointJsonEditor 
                          Projectid={Projectid} 
                          endpointId={parseInt(endpoint.endpointid)} 
                          initialPayload={endpoint.Payload} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && <CollborateModal onClose={toggleModal} proj={Projectid} />}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteEndpoint}
        title="Delete Endpoint"
        message="This action cannot be undone. The endpoint and all its configuration will be permanently deleted."
        confirmButtonText="Delete Endpoint"
        type="danger"
        requiresTyping={true}
        requiredText="DELETE"
        isLoading={isDeleting}
        itemName={deleteModal.endpoint?.Endpoint}
      />
    </>
  );
};

export default EndpointList;