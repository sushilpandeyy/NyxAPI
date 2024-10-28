import React, { useState } from 'react';
import GeminiDataFetcher from './Gemini.jsx';

const FakeDataPopup = ({ apiKey, object, onGenerate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numEntries, setNumEntries] = useState(1);

  const togglePopup = () => setIsOpen(!isOpen);

  const handleFetchComplete = (generatedData) => {
    onGenerate(generatedData); // Send the generated data to the parent
    togglePopup(); // Close the popup after fetching data
  };

  return (
    <div>
      <button onClick={togglePopup} className="bg-blue-500 text-white px-4 py-2 rounded">
        Generate Fake Data
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 w-80 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Generate Fake Data</h2>
            <label className="block text-white font-medium mb-2">Number of Entries</label>
            <input
              type="number"
              value={numEntries}
              onChange={(e) => setNumEntries(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2 mb-4 border rounded"
              min="1"
            />
            <div className="flex justify-between">
              <GeminiDataFetcher
                apiKey={apiKey}
                numEntries={numEntries}
                object={object}
                onFetchComplete={handleFetchComplete}
              />
              <button
                onClick={togglePopup}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeDataPopup;
