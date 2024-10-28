import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EndpointJsonEditor = ({ Projectid, endpointId }) => {
  const [jsonData, setJsonData] = useState('{}');
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const websocketRef = useRef(null);
  console.log(endpointId)

  useEffect(() => {
    const websocketUrl = `ws://127.0.0.1:8000/ws/${Projectid}/${endpointId}`;
    websocketRef.current = new WebSocket(websocketUrl);

    websocketRef.current.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setJsonData(JSON.stringify(newData, null, 2));
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    websocketRef.current.onerror = () => {
      setError('WebSocket error');
    };

    websocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [Projectid, endpointId]);

  const handleJsonChange = (e) => {
    const newJsonData = e.target.value;
    setJsonData(newJsonData);

    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(newJsonData);
    }
  };

  const handleSave = async () => {
    try {
      const payload = { payload: jsonData };
      await axios.put(`http://localhost:8000/endpoints/update_payload/${parseInt(endpointId)}`, payload);
      setSaveStatus('Data saved successfully!');
      setError('');
    } catch (err) {
      setError('Failed to save data. Please try again.');
      setSaveStatus('');
    }
  };

  return (
    <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Edit JSON Data for Endpoint {endpointId}</h2>
      
      <textarea
        value={jsonData}
        onChange={handleJsonChange}
        rows="8"
        className="w-full h-40 p-4 bg-gray-900 text-white rounded-lg resize-none"
      ></textarea>
      
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
      >
        Save
      </button>

      {saveStatus && <p className="text-green-400 mt-2">{saveStatus}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default EndpointJsonEditor;
