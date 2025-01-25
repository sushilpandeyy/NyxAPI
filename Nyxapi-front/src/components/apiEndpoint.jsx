import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserFriends, FaEllipsisV } from 'react-icons/fa';
import nyxLogo from '../assets/nyxLogo.webp';
import CollborateModal from './CollborateModal';

const EndpointScreen = () => {
 const { Projectid } = useParams();
 const [endpoint, setEndpoint] = useState('');
 const [jsonData, setJsonData] = useState('');
 const [showJsonInput, setShowJsonInput] = useState(false);
 const [endpoints, setEndpoints] = useState([]);
 const [error, setError] = useState('');
 const [isModalOpen, setIsModalOpen] = useState(false);
 const wsRef = useRef(null);

 useEffect(() => {
   fetchEndpoints();
   setupWebSocket();
   return () => wsRef.current?.close();
 }, [Projectid]);

 const fetchEndpoints = async () => {
   try {
     const { data } = await axios.get(`https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/endpoints/${Projectid}`);
     setEndpoints(data.endpoint_info);
   } catch (err) {
     setError('Failed to fetch endpoints');
   }
 };

 const setupWebSocket = () => {
   wsRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/${Projectid}`);
   wsRef.current.onmessage = (event) => {
     try {
       setJsonData(JSON.stringify(JSON.parse(event.data), null, 2));
     } catch (err) {
       setError('WebSocket error');
     }
   };
 };

 const handleSave = async () => {
   try {
     const payload = {
       Endpoint: endpoint,
       Projectid: parseInt(Projectid),
       Apitype: "GET",
       Payload: JSON.parse(jsonData)
     };
     await axios.post('https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/endpoints/', payload);
     fetchEndpoints();
     setShowJsonInput(false);
   } catch (err) {
     setError('Invalid JSON data');
   }
 };

 return (
   <div className="container mx-auto px-4 py-8">
     <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800">
       <div className="flex justify-between items-center mb-8">
         <div className="flex items-center gap-3">
           <img src={nyxLogo} alt="NyxAPI" className="w-8 h-8" />
           <h1 className="text-2xl font-bold text-white">API Endpoints</h1>
         </div>
         <div className="flex gap-4">
           <FaUserFriends 
             onClick={() => setIsModalOpen(true)} 
             className="text-gray-400 hover:text-white cursor-pointer" 
           />
           <FaEllipsisV className="text-gray-400 hover:text-white cursor-pointer" />
         </div>
       </div>

       <div className="space-y-6">
         <div className="flex items-center">
           <span className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-l">
             http://{Projectid}.nyxapi.com/
           </span>
           <input
             value={endpoint}
             onChange={(e) => setEndpoint(e.target.value)}
             className="flex-1 px-3 py-2 bg-white text-gray-900 rounded-r"
             placeholder="endpoint-path"
           />
         </div>

         <div className="flex gap-3">
           <button 
             onClick={() => setShowJsonInput(!showJsonInput)}
             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
           >
             New Resource
           </button>
         </div>

         {showJsonInput && (
           <div className="space-y-4">
             <textarea
               value={jsonData}
               onChange={(e) => setJsonData(e.target.value)}
               className="w-full h-48 p-4 bg-gray-800 text-white rounded-lg"
               placeholder="Enter JSON data"
             />
             <button
               onClick={handleSave}
               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
             >
               Save
             </button>
           </div>
         )}

         <div className="space-y-4">
           {endpoints.map(ep => (
             <div key={ep.id} className="bg-gray-800 p-4 rounded-lg">
               <div className="flex justify-between items-center">
                 <span className="text-blue-400">/{ep.Endpoint}</span>
                 <span className="text-gray-400">{ep.Apitype}</span>
               </div>
               <pre className="mt-2 text-sm text-gray-300">{JSON.stringify(ep.Payload, null, 2)}</pre>
             </div>
           ))}
         </div>
       </div>
     </div>

     {isModalOpen && <CollborateModal toggleModal={() => setIsModalOpen(false)} />}
   </div>
 );
};

export default EndpointScreen;