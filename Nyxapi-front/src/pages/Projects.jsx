import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus } from 'react-icons/fi';
import Createproject from '../components/createproject';

const Projects = () => {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [projects, setProjects] = useState([]);
 const [userId, setUserId] = useState(null);

 const defaultImage = 'https://cdn4.vectorstock.com/i/1000x1000/71/28/square-loader-icon-circle-button-load-sign-symbol-vector-29007128.jpg';

 useEffect(() => {
   const user = JSON.parse(sessionStorage.getItem('user'));
   if (!user) window.location.href = '/login';
   setUserId(user.user_id);
   fetchProjects(user.user_id);
 }, []);

 const fetchProjects = async (userId) => {
   try {
     const response = await axios.get(`https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/project/?userid=${userId}`);
     if (response.data?.Projects) setProjects(response.data.Projects);
   } catch (err) {
     console.error('Error:', err);
   }
 };

 return (
   <div className="container mx-auto px-4 py-8">
     <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800">
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold text-white">Projects</h1>
         <button
           onClick={() => setIsModalOpen(true)}
           className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-white transition-colors"
         >
           <FiPlus className="inline mr-2" />
           New Project
         </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {projects.map((project) => (
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
             <p className="text-gray-400 text-xs">Created: {new Date(project.created).toLocaleDateString()}</p>
           </div>
         ))}

         <button
           onClick={() => setIsModalOpen(true)}
           className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center gap-3"
         >
           <FiPlus className="text-2xl text-indigo-400" />
           <span className="text-gray-300 font-medium">Create Project</span>
         </button>
       </div>
     </div>

     {isModalOpen && <Createproject toggleModal={() => setIsModalOpen(false)} />}
   </div>
 );
};

export default Projects;