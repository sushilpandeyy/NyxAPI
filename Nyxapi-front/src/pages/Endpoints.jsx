// EndpointScreen.js
//import React from 'react';
//import EndpointList from '../components/Endpointlist';
//import EndpointJsonEditor from '../components/Endpointsjson';
//
//const EndpointScreen = () => {
//  return (
//    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white pt-16">
//      <EndpointList />
//      <EndpointJsonEditor />
//    </div>
//  );
//};
//
//export default EndpointScreen;
// Endpoints.js
import React from 'react';
import CreateEndpoint from '../components/CreateEndpoint';
import EndpointList from '../components/Endpointlist';

const Endpoints = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-dark-950 text-white pt-8 px-4">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="heading-1 mb-4">API Endpoints</h1>
          <p className="text-body max-w-2xl mx-auto">
            Create and manage your mock API endpoints with multiple HTTP methods and custom responses.
          </p>
        </div>
        
        <CreateEndpoint />
        <EndpointList />
      </div>
    </div>
  );
};

export default Endpoints;
