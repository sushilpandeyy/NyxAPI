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
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white pt-16">
      <h1 className="text-4xl font-bold text-center mb-8">Manage API Endpoints</h1>
      <CreateEndpoint />
      <EndpointList />
    </div>
  );
};

export default Endpoints;
