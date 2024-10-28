import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EndpointJsonEditor = ({ Projectid, endpointId }) => {
  const [jsonData, setJsonData] = useState('{}');
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const websocketRef = useRef(null);
  console.log(endpointId);

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

  const sanitizeInput = (input) => {
    return input.replace(/"/g, '[[DQ]]'); // Replace double quotes with placeholder
  };

  const restoreOutput = (output) => {
    return output.replace(/\[\[DQ\]\]/g, '"'); // Restore placeholder back to double quotes
  };

  const handleJsonChange = (e) => {
    const newJsonData = e.target.value;
    setJsonData(newJsonData);

    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(newJsonData);
    }
  };

  const handleSave = async () => {
    try {
      const sanitizedJsonData = sanitizeInput(jsonData); // Sanitize before saving
      const payload = { payload: sanitizedJsonData };
      await axios.put(`http://localhost:8000/endpoints/update_payload/${parseInt(endpointId)}`, payload);
      setSaveStatus('Data saved successfully!');
      setError('');
    } catch (err) {
      setError('Failed to save data. Please try again.');
      setSaveStatus('');
    }
  };

  // Restore the output when loading data into the editor
  const restoredJsonData = restoreOutput(jsonData);

  return (
    <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg">
      <h2 className="text-white text-lg font-bold mb-4">JSON Editor</h2>
      <textarea
        value={restoredJsonData}
        onChange={handleJsonChange}
        rows={10}
        className="w-full p-2 rounded-md bg-gray-900 text-white border border-gray-600"
      />
      <div className="flex justify-between mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          Save
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {saveStatus && <p className="text-green-500">{saveStatus}</p>}
      </div>
    </div>
  );
};

export default EndpointJsonEditor;
