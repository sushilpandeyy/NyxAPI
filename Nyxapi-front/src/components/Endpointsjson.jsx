import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Utility Functions: Encode and Decode JSON
const encodeObject = (obj) => {
  try {
    return JSON.stringify(obj)
      .replace(/"/g, '[[DQ]]')
      .replace(/:/g, '[[COLON]]')
      .replace(/,/g, '[[COMMA]]');
  } catch (error) {
    console.error("Encoding failed:", error);
    return '';
  }
};

const decodeObject = (codedString) => {
  try {
    return JSON.parse(
      codedString
        .replace(/\[\[DQ\]\]/g, '"')
        .replace(/\[\[COLON\]\]/g, ':')
        .replace(/\[\[COMMA\]\]/g, ',')
    );
  } catch (error) {
    console.error("Failed to decode object:", error);
    return null;
  }
};

const EndpointJsonEditor = ({ Projectid, endpointId, initialPayload = '{}' }) => {
  const [jsonData, setJsonData] = useState(() => {
    const decoded = decodeObject(initialPayload);
    return JSON.stringify(decoded, null, 2) || '{}';
  });
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [numEntries, setNumEntries] = useState(1);
  const websocketRef = useRef(null);

  useEffect(() => {
    const websocketUrl = `ws://127.0.0.1:8000/ws/${Projectid}/${endpointId}`;
    const ws = new WebSocket(websocketUrl);
    websocketRef.current = ws;

    ws.onopen = () => console.log('WebSocket connection established');
    ws.onmessage = (event) => {
      const decodedData = decodeObject(event.data);
      if (decodedData) setJsonData(JSON.stringify(decodedData, null, 2));
    };
    ws.onerror = () => setError('WebSocket connection error');
    ws.onclose = () => console.log('WebSocket connection closed');

    return () => ws.close();
  }, [Projectid, endpointId]);

  const handleJsonChange = (e) => {
    const newJsonData = e.target.value;
    setJsonData(newJsonData);
    setError(''); // Clear errors on change

    try {
      const parsedData = JSON.parse(newJsonData);
      if (websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.send(encodeObject(parsedData));
      }
    } catch {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  const handleSave = async () => {
    try {
      const parsedData = JSON.parse(jsonData);
      const payload = { payload: encodeObject(parsedData) };

      await axios.put(
        `http://localhost:8080/endpoints/update_payload/${parseInt(endpointId)}`,
        payload
      );
      setSaveStatus('Data saved successfully!');
    } catch (err) {
      setError('Failed to save data. Please check your input and try again.');
      setSaveStatus('');
    }
  };

  const handleGeneratedData = async () => {
    try {
      const prompt = `Create ${numEntries} more similar data entries in JSON format specific to: ${jsonData}`;
      const apiKey = 'AIzaSyD8ZBJkzUkpC46RmH6D84K8R9XwzwSAbSU';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

      const response = await axios.post(apiUrl, {
        prompt: {
          contents: [{ parts: [{ text: prompt }] }]
        }
      });

      const generatedContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      const generatedData = JSON.parse(generatedContent);

      if (Array.isArray(generatedData)) {
        const combinedData = JSON.stringify(
          [...JSON.parse(jsonData), ...generatedData],
          null,
          2
        );
        setJsonData(combinedData);
        setIsPopupOpen(false);
      } else {
        setError('Generated data is not valid JSON.');
      }
    } catch (error) {
      setError('Failed to generate data. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-bold text-white">JSON Editor</h2>
      <textarea
        className="w-full h-64 p-2 text-black"
        value={jsonData}
        onChange={handleJsonChange}
      />
      <div className="mt-4">
        <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded">
          Save
        </button>
        {/*<button onClick={() => setIsPopupOpen(true)} className="p-2 bg-green-500 text-white rounded ml-2">
          Generate Fake Data
  </button>*/}
      </div>

      {isPopupOpen && (
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
              <button
                onClick={handleGeneratedData}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Generate
              </button>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
      {saveStatus && <p className="text-green-500">{saveStatus}</p>}
    </div>
  );
};

export default EndpointJsonEditor;