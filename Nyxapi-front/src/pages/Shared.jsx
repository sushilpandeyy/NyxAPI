import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Shared = () => {
 const [projects, setProjects] = useState([]);
 const defaultImage = 'https://cdn4.vectorstock.com/i/1000x1000/71/28/square-loader-icon-circle-button-load-sign-symbol-vector-29007128.jpg';

 useEffect(() => {
   const user = JSON.parse(sessionStorage.getItem('user'));
   if (!user) return window.location.href = '/login';
   fetchProjects(user.user_id);
 }, []);

 const fetchProjects = async (userId) => {
   try {
     const response = await axios.get(`https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/share/?userid=${userId}`);
     setProjects(response.data?.data || []);
   } catch (error) {
     console.error('Error:', error);
   }
 };

 return (
   <div className="container mx-auto px-4 py-8">
     <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800">
       <h1 className="text-3xl font-bold text-white mb-8">Shared Projects</h1>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {projects.length > 0 ? projects.map((project) => (
           <div
             key={project.id}
             onClick={() => window.location.href = `/dashboard/endpoints/${project.Projectid}`}
             className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700"
           >
             <div className="flex items-center gap-4 mb-4">
               <img 
                 src={project.Img || defaultImage}
                 alt={project.Title}
                 className="w-12 h-12 rounded-lg object-cover"
               />
               <h3 className="text-lg font-semibold text-white">{project.Title}</h3>
             </div>
             <p className="text-gray-300 text-sm mb-2">{project.Description}</p>
             <p className="text-gray-400 text-xs">By: {project.user.name}</p>
             <p className="text-gray-400 text-xs">Created: {new Date(project.created).toLocaleDateString()}</p>
           </div>
         )) : (
           <p className="text-gray-400">No shared projects available</p>
         )}
       </div>
     </div>
   </div>
 );
};

export default Shared;