import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Usage = () => {
 const [usageData, setUsageData] = useState({ projects: 5, endpoints: 20 });
 const [loading, setLoading] = useState(true);
 
 const maxProjects = 10;
 const maxEndpoints = 50;

 useEffect(() => {
   const dummyUser = {
     user_id: 123,
     name: 'John Doe',
     projects: 5,
     endpoints: 20
   };
   setUsageData({
     projects: dummyUser.projects,
     endpoints: dummyUser.endpoints
   });
   setLoading(false);
 }, []);

 if (loading) return <p className="text-white">Loading...</p>;

 return (
   <div className="container mx-auto px-4 py-8">
     <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800 max-w-xl mx-auto">
       <h1 className="text-3xl font-bold text-white mb-8 text-center">Usage Overview</h1>

       <div className="grid grid-cols-2 gap-8 mb-8">
         <div className="flex flex-col items-center">
           <div className="w-32 h-32">
             <CircularProgressbar
               value={(usageData.projects / maxProjects) * 100}
               text={`${usageData.projects}/${maxProjects}`}
               styles={buildStyles({
                 pathColor: '#6366f1',
                 textColor: '#fff',
                 trailColor: '#374151'
               })}
             />
           </div>
           <p className="mt-4 text-gray-300">Projects</p>
         </div>

         <div className="flex flex-col items-center">
           <div className="w-32 h-32">
             <CircularProgressbar
               value={(usageData.endpoints / maxEndpoints) * 100}
               text={`${usageData.endpoints}/${maxEndpoints}`}
               styles={buildStyles({
                 pathColor: '#6366f1',
                 textColor: '#fff',
                 trailColor: '#374151'
               })}
             />
           </div>
           <p className="mt-4 text-gray-300">Endpoints</p>
         </div>
       </div>

       <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors">
         Upgrade Plan
       </button>
     </div>
   </div>
 );
};

export default Usage;