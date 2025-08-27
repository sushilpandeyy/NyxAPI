import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Share2, Settings, CreditCard, LogOut, Menu, X, User } from 'lucide-react';
import logo from "../assets/logo.png";

const Layout = () => {
 const [user, setUser] = useState(null);
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const navigate = useNavigate();

 useEffect(() => {
   const userData = JSON.parse(sessionStorage.getItem('user'));
   if (!userData) {
     navigate('/login');
   } else {
     setUser(userData);
   }
 }, [navigate]);

 const handleLogout = () => {
   sessionStorage.clear();
   navigate('/login');
 };

 if (!user) {
   return (
     <div className="min-h-screen bg-dark-950 flex items-center justify-center">
       <div className="flex flex-col items-center">
         <div className="spinner w-8 h-8 text-primary-500"></div>
         <p className="mt-4 text-dark-400">Loading...</p>
       </div>
     </div>
   );
 }

 return (
   <div className="min-h-screen bg-dark-950 flex">
     {/* Mobile sidebar backdrop */}
     {sidebarOpen && (
       <div 
         className="fixed inset-0 bg-black/50 z-40 lg:hidden"
         onClick={() => setSidebarOpen(false)}
       />
     )}

     {/* Sidebar */}
     <aside className={`sidebar transform transition-transform lg:translate-x-0 z-50 ${
       sidebarOpen ? 'translate-x-0' : '-translate-x-full'
     }`}>
       <div className="flex flex-col h-full p-6">
         {/* Logo */}
         <div className="flex items-center gap-3 mb-8">
           <img src={logo} alt="NyxAPI Logo" className="w-8 h-8 rounded-lg" />
           <h1 className="heading-4">
             Nyx<span className="text-primary-500">API</span>
           </h1>
         </div>

         {/* User Profile */}
         <div className="card p-4 mb-6">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
               <User size={18} className="text-white" />
             </div>
             <div>
               <p className="font-medium text-white text-sm">{user.name || user.email}</p>
               <p className="text-muted text-xs">Free Plan</p>
             </div>
           </div>
         </div>

         {/* Navigation */}
         <nav className="flex-1 space-y-2">
           <SidebarLink to="/dashboard" icon={<Home size={18} />} end>
             Projects
           </SidebarLink>
           
           <SidebarLink to="/dashboard/shared" icon={<Share2 size={18} />}>
             Shared with Me
           </SidebarLink>
           
           <SidebarLink to="/dashboard/subscription" icon={<CreditCard size={18} />}>
             Subscription
           </SidebarLink>
           
           <SidebarLink to="/dashboard/settings" icon={<Settings size={18} />}>
             Settings
           </SidebarLink>
         </nav>

         {/* Logout */}
         <button
           onClick={handleLogout}
           className="nav-link text-error-400 hover:bg-error-600/10 mt-4"
         >
           <LogOut size={18} className="mr-3" />
           <span>Sign Out</span>
         </button>
       </div>
     </aside>

     {/* Main Content */}
     <main className="flex-1 lg:ml-64 flex flex-col">
       {/* Mobile header */}
       <header className="lg:hidden bg-dark-900 border-b border-dark-700 px-4 py-4">
         <div className="flex items-center justify-between">
           <h1 className="heading-4">
             Nyx<span className="text-primary-500">API</span>
           </h1>
           <button
             onClick={() => setSidebarOpen(true)}
             className="btn-ghost p-2"
           >
             <Menu size={20} />
           </button>
         </div>
       </header>

       {/* Page content */}
       <div className="flex-1 p-6 lg:p-8">
         <Outlet />
       </div>
     </main>
   </div>
 );
};

// Sidebar Link Component
const SidebarLink = ({ to, icon, children, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      isActive ? 'nav-link-active' : 'nav-link'
    }
  >
    {icon && <span className="mr-3">{icon}</span>}
    <span>{children}</span>
  </NavLink>
);

export default Layout;