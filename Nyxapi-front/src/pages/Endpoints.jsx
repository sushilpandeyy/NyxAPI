// EndpointScreen.js
import React from 'react';
import EndpointList from '../components/Endpointlist';
import EndpointJsonEditor from '../components/Endpointsjson';

const EndpointScreen = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white pt-16">
      <EndpointList />
      <EndpointJsonEditor />
    </div>
  );
};

export default EndpointScreen;
