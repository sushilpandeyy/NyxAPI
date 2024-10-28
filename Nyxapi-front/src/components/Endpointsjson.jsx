import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EndpointJsonEditor = ({ Projectid, endpointId, initialPayload = '{}' }) => {
  const [jsonData, setJsonData] = useState(initialPayload);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const websocketRef = useRef(null);

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

  // Function to sanitize input by replacing double quotes, colons, and commas
  const sanitizeInput = (input) => {
    return input
      .replace(/"/g, '[[DQ]]')        // Replace double quotes
      .replace(/:/g, '[[COLON]]')     // Replace colons
      .replace(/,/g, '[[COMMA]]');    // Replace commas
  };

  // Function to restore output by replacing placeholders back to their original characters
  const restoreOutput = (output) => {
    return output
      .replace(/\[\[DQ\]\]/g, '"')     // Restore double quotes
      .replace(/\[\[COLON\]\]/g, ':')  // Restore colons
      .replace(/\[\[COMMA\]\]/g, ','); // Restore commas
  };

  const handleSave = async () => {
    try {
      const sanitizedPayload = sanitizeInput(jsonData); // Sanitize before saving
      const payload = { payload: sanitizedPayload };

      await axios.put(`http://localhost:8000/endpoints/update_payload/${parseInt(endpointId)}`, payload);
      setSaveStatus('Data saved successfully!');
      setError('');
    } catch (err) {
      setError('Failed to save data. Please try again.');
      setSaveStatus('');
    }
  };

  // Restore the output when displaying it (if necessary)
  const displayedJsonData = restoreOutput(jsonData);

  return (
    <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-bold text-white">JSON Editor</h2>
      <textarea
        className="w-full h-64 p-2 text-black"
        value={displayedJsonData} // Use restored data for display
        onChange={handleJsonChange}
      />
      <div className="mt-4">
        <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded">
          Save
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {saveStatus && <p className="text-green-500">{saveStatus}</p>}
    </div>
  );
};

export default EndpointJsonEditor;
