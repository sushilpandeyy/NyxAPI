import React from 'react';

const Subscription = () => {
 return (
   <div className="container mx-auto px-4 py-8">
     <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800 max-w-2xl mx-auto">
       <div className="text-center mb-8">
         <h1 className="text-3xl font-bold text-indigo-500 mb-4">Subscription Plans</h1>
         <p className="text-gray-300">
           Choose a plan that fits your needs. Our Free Tier includes unlimited endpoints and essential features to get started.
         </p>
       </div>

       <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
         <h2 className="text-2xl font-bold text-indigo-400 mb-4">Free Tier</h2>
         <ul className="space-y-3 text-gray-300 mb-6">
           <li className="flex items-center gap-2">
             <span className="text-green-500">✓</span>
             Unlimited Endpoints
           </li>
           <li className="flex items-center gap-2">
             <span className="text-green-500">✓</span>
             Basic API Access
           </li>
           <li className="flex items-center gap-2">
             <span className="text-green-500">✓</span>
             No Expiry
           </li>
         </ul>
         <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors">
           Subscribed
         </button>
       </div>
     </div>
   </div>
 );
};

export default Subscription;