import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiShare2, FiSettings } from 'react-icons/fi';
import { MdOutlineSubscriptions } from 'react-icons/md';
import { CgLogOut } from "react-icons/cg";
import logo from "../assets/logo.png"

const Layout = () => {
 const [name, setName] = useState("");
 const navigate = useNavigate();

 useEffect(() => {
   const user = JSON.parse(sessionStorage.getItem('user'));
   if (!user) navigate('/login');
   else setName(user.name);
 }, [navigate]);

 return (
   <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
     <aside className="fixed top-0 left-0 h-full w-64 p-6 bg-gray-900 border-r border-gray-800">
       <div className="flex flex-col h-full">
         <div className="flex items-center gap-3 mb-8">
           <img src={logo} alt="NyxAPI Logo" className="w-10 h-10 rounded-full" />
           <h1 className="text-xl font-bold text-white">NyxAPI</h1>
         </div>

         <nav className="space-y-2">
           <NavLink to="/dashboard" end
             className={({ isActive }) =>
               `flex items-center px-4 py-3 rounded-lg transition-colors ${
                 isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
               }`
             }
           >
             <FiHome className="mr-3" />
             <span>Dashboard</span>
           </NavLink>

           <NavLink to="/dashboard/shared"
             className={({ isActive }) =>
               `flex items-center px-4 py-3 rounded-lg transition-colors ${
                 isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
               }`
             }
           >
             <FiShare2 className="mr-3" />
             <span>Shared Projects</span>
           </NavLink>

           <NavLink to="/dashboard/subscription"
             className={({ isActive }) =>
               `flex items-center px-4 py-3 rounded-lg transition-colors ${
                 isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
               }`
             }
           >
             <MdOutlineSubscriptions className="mr-3" />
             <span>Subscription</span>
           </NavLink>

           <NavLink to="/dashboard/settings"
             className={({ isActive }) =>
               `flex items-center px-4 py-3 rounded-lg transition-colors ${
                 isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
               }`
             }
           >
             <FiSettings className="mr-3" />
             <span>Settings</span>
           </NavLink>
         </nav>

         <button
           onClick={() => {
             sessionStorage.clear();
             navigate('/login');
           }}
           className="mt-auto flex items-center px-4 py-3 text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
         >
           <CgLogOut className="mr-3" />
           <span>Logout</span>
         </button>
       </div>
     </aside>

     <main className="flex-1 ml-64 p-8">
       <Outlet />
     </main>
   </div>
 );
};

export default Layout;