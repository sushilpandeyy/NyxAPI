import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
 const navigate = useNavigate();
 const user = JSON.parse(sessionStorage.getItem('user'));

 return (
   <div className="container mx-auto px-4 py-8">
     <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800 max-w-xl mx-auto">
       <h1 className="text-3xl font-bold text-white mb-8 text-center">Settings</h1>

       <div className="space-y-6">
         <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
           <h2 className="text-xl font-semibold text-white mb-4">Profile</h2>
           <div className="space-y-3">
             <div className="flex justify-between">
               <span className="text-gray-400">Name</span>
               <span className="text-white">{user?.name || 'N/A'}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-400">Email</span>  
               <span className="text-white">{user?.email || 'N/A'}</span>
             </div>
           </div>
         </div>

         <button
           onClick={() => {
             sessionStorage.removeItem('user');
             navigate('/login');
           }}
           className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
         >
           Logout
         </button>
       </div>
     </div>
   </div>
 );
};

export default Settings;