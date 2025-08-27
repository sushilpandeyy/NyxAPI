import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Plus, Settings, Users, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import CollborateModal from './CollborateModal';
import { API_ENDPOINTS } from '../config/api';

const CreateEndpoint = () => {
  const { Projectid } = useParams();
  const [endpoint, setEndpoint] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // HTTP Methods state
  const [httpMethods, setHttpMethods] = useState({
    GET: true,
    POST: false,
    PUT: false,
    DELETE: false,
    PATCH: false,
    HEAD: false,
    OPTIONS: false
  });

  const httpMethodColors = {
    GET: 'bg-success-600 text-white border-success-600',
    POST: 'bg-primary-600 text-white border-primary-600',
    PUT: 'bg-warning-600 text-white border-warning-600',
    DELETE: 'bg-error-600 text-white border-error-600',
    PATCH: 'bg-primary-700 text-white border-primary-700',
    HEAD: 'bg-dark-600 text-white border-dark-600',
    OPTIONS: 'bg-dark-500 text-white border-dark-500'
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleHttpMethod = (method) => {
    setHttpMethods(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };

  const getSelectedMethods = () => {
    return Object.entries(httpMethods)
      .filter(([_, enabled]) => enabled)
      .map(([method, _]) => method);
  };

  const handleCreateEndpoint = async () => {
    if (!endpoint.trim()) {
      showNotification('Please enter an endpoint path', 'error');
      return;
    }

    const selectedMethods = getSelectedMethods();
    if (selectedMethods.length === 0) {
      showNotification('Please select at least one HTTP method', 'error');
      return;
    }

    setIsCreating(true);

    try {
      // Create endpoint for each selected HTTP method
      const promises = selectedMethods.map(method => {
        const payload = {
          Endpoint: endpoint,
          Projectid: parseInt(Projectid, 10),
          Apitype: method,
          Payload: JSON.stringify({
            message: `${method} response for ${endpoint}`,
            timestamp: new Date().toISOString(),
            data: method === 'GET' ? { example: 'data' } : {}
          })
        };
        return axios.post(API_ENDPOINTS.ENDPOINTS, payload);
      });

      await Promise.all(promises);
      
      setEndpoint('');
      setHttpMethods({ GET: true, POST: false, PUT: false, DELETE: false, PATCH: false, HEAD: false, OPTIONS: false });
      showNotification(`Endpoint created successfully with ${selectedMethods.length} method(s): ${selectedMethods.join(', ')}`);
      
      // Reload after delay to show notification
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Error creating endpoint:', error);
      showNotification('Failed to create endpoint. Please try again.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create New Endpoint</h2>
                <p className="text-primary-100">Define your API endpoint with multiple HTTP methods</p>
              </div>
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

        {/* Main Content */}
        <div className="bg-dark-900 rounded-b-xl p-6 shadow-xl border border-dark-700">
          {/* URL Input Section */}
          <div className="mb-8">
            <label className="block text-primary-300 font-semibold mb-3 text-sm">
              API ENDPOINT URL
            </label>
            <div className="flex items-stretch rounded-lg overflow-hidden border border-dark-600 focus-within:border-primary-500 transition-colors">
              <div className="bg-dark-800 px-4 py-3 text-primary-400 font-mono text-sm flex items-center border-r border-dark-600">
                http://{Projectid}.localhost:8000/
              </div>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="users/profile"
                className="flex-1 bg-dark-800 px-4 py-3 text-white placeholder-dark-400 font-mono text-sm focus:outline-none"
              />
            </div>
            {endpoint && (
              <div className="mt-2 p-3 bg-dark-800/50 rounded-lg border border-dark-600">
                <p className="text-xs text-dark-400 mb-1">Preview URL:</p>
                <p className="font-mono text-sm text-primary-400 break-all">
                  http://{Projectid}.localhost:8000/{endpoint}
                </p>
              </div>
            )}
          </div>

          {/* HTTP Methods Section */}
          <div className="mb-8">
            <label className="block text-primary-300 font-semibold mb-4 text-sm">
              HTTP METHODS
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {Object.entries(httpMethods).map(([method, enabled]) => (
                <button
                  key={method}
                  onClick={() => toggleHttpMethod(method)}
                  className={`
                    relative p-3 rounded-lg border-2 font-semibold text-sm transition-all duration-200 transform
                    ${enabled 
                      ? httpMethodColors[method] + ' scale-105 shadow-medium' 
                      : 'bg-dark-800 text-dark-400 border-dark-600 hover:border-dark-500 hover:text-dark-300'
                    }
                  `}
                >
                  {enabled && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <CheckCircle size={12} className="text-success-600" />
                    </div>
                  )}
                  {method}
                </button>
              ))}
            </div>
            <p className="text-xs text-dark-400 mt-2">
              Selected methods: {getSelectedMethods().join(', ') || 'None'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCreateEndpoint}
              disabled={isCreating || !endpoint.trim()}
              className="btn-primary transform hover:scale-105 disabled:transform-none"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Endpoint
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                setEndpoint('');
                setHttpMethods({ GET: true, POST: false, PUT: false, DELETE: false, PATCH: false, HEAD: false, OPTIONS: false });
              }}
              className="btn-secondary"
            >
              Reset Form
            </button>
          </div>

          {/* Helper Info */}
          <div className="mt-6 p-4 bg-dark-800/50 rounded-lg border border-dark-600">
            <div className="flex items-start gap-3">
              <Settings size={16} className="text-primary-400 mt-0.5" />
              <div>
                <h4 className="text-primary-300 font-medium text-sm mb-1">Pro Tip</h4>
                <p className="text-dark-400 text-xs leading-relaxed">
                  Select multiple HTTP methods to create comprehensive REST endpoints. Each method will have its own response configuration that you can customize later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isModalOpen && <CollborateModal toggleModal={toggleModal} proj={Projectid} />}
    </>
  );
};

export default CreateEndpoint;