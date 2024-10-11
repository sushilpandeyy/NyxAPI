import React from 'react';
import Navbar from './navbar';
import { FaUserFriends, FaEllipsisV } from 'react-icons/fa';
import nyxLogo from '../assets/nyxLogo.webp';

const EndpointSection = () => {
  return (
    <div className="flex flex-col items-center min-h-screen pt-16 text-white bg-gray-900">
      <div className="flex items-center justify-between w-full max-w-3xl mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">
            Projects /
          </h1>
          <img 
            src={nyxLogo} 
            alt="NyxAPI Logo" 
            className="w-8 h-8 mx-2"
          />
          <span className="text-3xl font-bold text-pink-600">NyxAPI</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <FaUserFriends className="text-xl text-gray-400 cursor-pointer hover:text-white" title="Collaborators" />
          <FaEllipsisV className="text-xl text-gray-400 cursor-pointer hover:text-white" title="More options" />
        </div>
      </div>

      <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg">
        <h2 className="mb-4 text-2xl font-bold text-white">API endpoint</h2>
        
        <div className="mb-4">
          <a
            href="https://670052c74da5bd237553cd95.mockapi.io/api/test/:endpoint"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full p-2 font-mono text-sm text-blue-800 break-all bg-blue-100 rounded"
          >
            https://670052c74da5bd237553cd95.mockapi.io/api/test/
            <span className="p-1 text-orange-700 bg-orange-100 rounded">:endpoint</span>
          </a>
        </div>

        <div className="flex gap-4">
          <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
            New resource
          </button>
          <button className="px-4 py-2 text-gray-200 bg-gray-700 rounded hover:bg-gray-600">
            Generate all
          </button>
          <button className="px-4 py-2 text-gray-200 bg-gray-700 rounded hover:bg-gray-600">
            Reset all
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400">🔍 No resources yet...</p>
        </div>
      </div>
    </div>
  );
};

const EndpointScreen = () => {
  return (
    <>
      <Navbar />
      <EndpointSection />
    </>
  );
};

export default EndpointScreen;
