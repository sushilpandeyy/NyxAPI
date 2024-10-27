import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const EndpointJsonEditor = () => {
  const { Projectid } = useParams();
  const [jsonData, setJsonData] = useState('{}');
  const [error, setError] = useState('');
  const websocketRef = useRef(null);

  useEffect(() => {
    const websocketUrl = `ws://127.0.0.1:8000/ws/${Projectid}`;
    websocketRef.current = new WebSocket(websocketUrl);

    websocketRef.current.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setJsonData(JSON.stringify(newData, null, 2));
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    websocketRef.current.onerror = (event) => {
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
  }, [Projectid]);

  const handleJsonChange = (e) => {
    const newJsonData = e.target.value;
    setJsonData(newJsonData);

    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(newJsonData);
    }
  };

  return (
    <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Edit JSON Data for Project {Projectid}</h2>
      <textarea
        value={jsonData}
        onChange={handleJsonChange}
        className="w-full h-96 p-4 bg-gray-900 text-white rounded-lg resize-none"
      ></textarea>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default EndpointJsonEditor;