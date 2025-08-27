import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Calendar, Shield, LogOut, Edit2, Save, X, Trash2 } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { API_ENDPOINTS } from '../config/api';

const Settings = () => {
 const navigate = useNavigate();
 const user = JSON.parse(sessionStorage.getItem('user'));
 const [isEditing, setIsEditing] = useState(false);
 const [editData, setEditData] = useState({
   name: user?.name || '',
   email: user?.email || ''
 });
 const [deleteModal, setDeleteModal] = useState(false);
 const [isDeleting, setIsDeleting] = useState(false);
 const [error, setError] = useState('');

 const handleSave = () => {
   // In a real app, you'd save to the server here
   setIsEditing(false);
   // Update session storage
   const updatedUser = { ...user, ...editData };
   sessionStorage.setItem('user', JSON.stringify(updatedUser));
 };

 const handleLogout = () => {
   sessionStorage.removeItem('user');
   navigate('/login');
 };

 const handleDeleteAccount = () => {
   setDeleteModal(true);
 };

 const confirmDeleteAccount = async () => {
   try {
     setIsDeleting(true);
     setError('');
     
     // For account deletion, we need password confirmation
     // In a real scenario, you'd have a form to get the password
     const password = prompt('Please enter your password to confirm account deletion:');
     if (!password) {
       setIsDeleting(false);
       return;
     }

     const response = await axios.delete(`${API_ENDPOINTS.USERS}/${user.user_id}`, {
       data: {
         email: user.email,
         password: password,
         confirmation: 'DELETE'
       }
     });

     if (response.status === 200) {
       // Account deleted successfully
       sessionStorage.removeItem('user');
       navigate('/login');
     }
   } catch (err) {
     console.error('Error deleting account:', err);
     setError(err.response?.data?.detail || 'Failed to delete account. Please try again.');
   } finally {
     setIsDeleting(false);
   }
 };

 const closeDeleteModal = () => {
   if (!isDeleting) {
     setDeleteModal(false);
     setError('');
   }
 };

 if (!user) {
   navigate('/login');
   return null;
 }

 return (
   <div className="max-w-4xl mx-auto">
     {/* Header */}
     <div className="mb-8">
       <h1 className="heading-2">Account Settings</h1>
       <p className="text-body mt-2">
         Manage your account information and preferences.
       </p>
     </div>

     {/* Error Display */}
     {error && (
       <div className="mb-6 p-4 bg-error-900/50 border border-error-600 rounded-lg">
         <p className="text-error-300">{error}</p>
       </div>
     )}

     <div className="grid lg:grid-cols-3 gap-8">
       {/* Profile Section */}
       <div className="lg:col-span-2 space-y-6">
         <div className="card">
           <div className="flex items-center justify-between mb-6">
             <h2 className="heading-3">Profile Information</h2>
             {!isEditing ? (
               <button
                 onClick={() => setIsEditing(true)}
                 className="btn-ghost flex items-center gap-2"
               >
                 <Edit2 size={16} />
                 Edit
               </button>
             ) : (
               <div className="flex gap-2">
                 <button
                   onClick={handleSave}
                   className="btn-primary flex items-center gap-2 px-4 py-2"
                 >
                   <Save size={16} />
                   Save
                 </button>
                 <button
                   onClick={() => {
                     setIsEditing(false);
                     setEditData({ name: user.name || '', email: user.email || '' });
                   }}
                   className="btn-secondary flex items-center gap-2 px-4 py-2"
                 >
                   <X size={16} />
                   Cancel
                 </button>
               </div>
             )}
           </div>

           <div className="space-y-6">
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <label className="form-label">Full Name</label>
                 {isEditing ? (
                   <input
                     type="text"
                     value={editData.name}
                     onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                     className="form-input"
                     placeholder="Enter your full name"
                   />
                 ) : (
                   <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg">
                     <User size={18} className="text-dark-400" />
                     <span className="text-white">{user.name || 'Not provided'}</span>
                   </div>
                 )}
               </div>

               <div>
                 <label className="form-label">Email Address</label>
                 {isEditing ? (
                   <input
                     type="email"
                     value={editData.email}
                     onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                     className="form-input"
                     placeholder="Enter your email"
                   />
                 ) : (
                   <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg">
                     <Mail size={18} className="text-dark-400" />
                     <span className="text-white">{user.email || 'Not provided'}</span>
                   </div>
                 )}
               </div>
             </div>

             <div>
               <label className="form-label">User ID</label>
               <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg">
                 <Shield size={18} className="text-dark-400" />
                 <code className="text-primary-300 text-sm">{user.user_id}</code>
               </div>
               <p className="text-muted text-xs mt-1">
                 This is your unique identifier in the system.
               </p>
             </div>

             <div>
               <label className="form-label">Member Since</label>
               <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg">
                 <Calendar size={18} className="text-dark-400" />
                 <span className="text-white">
                   {user.created ? new Date(user.created).toLocaleDateString() : 'Unknown'}
                 </span>
               </div>
             </div>
           </div>
         </div>

         {/* Account Actions */}
         <div className="card">
           <h3 className="heading-4 mb-4">Account Actions</h3>
           <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
               <div>
                 <h4 className="font-medium text-white">Change Password</h4>
                 <p className="text-muted text-sm">Update your account password</p>
               </div>
               <button className="btn-secondary">
                 Change Password
               </button>
             </div>

             <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
               <div>
                 <h4 className="font-medium text-white">Download Data</h4>
                 <p className="text-muted text-sm">Export your account data</p>
               </div>
               <button className="btn-secondary">
                 Download
               </button>
             </div>
           </div>
         </div>
       </div>

       {/* Sidebar */}
       <div className="space-y-6">
         {/* Account Status */}
         <div className="card">
           <h3 className="heading-4 mb-4">Account Status</h3>
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <span className="text-dark-300">Plan</span>
               <span className="bg-primary-900/30 text-primary-300 px-2 py-1 rounded text-sm">
                 Free
               </span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-dark-300">Projects</span>
               <span className="text-white">Unlimited</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-dark-300">API Calls</span>
               <span className="text-white">1,000/month</span>
             </div>
           </div>
           <button className="btn-primary w-full mt-4">
             Upgrade Plan
           </button>
         </div>

         {/* Danger Zone */}
         <div className="card border-error-600/20">
           <h3 className="heading-4 mb-4 text-error-400">Danger Zone</h3>
           <p className="text-muted text-sm mb-4">
             These actions cannot be undone. Please be careful.
           </p>
           <div className="space-y-3">
             <button
               onClick={handleLogout}
               className="btn-secondary w-full flex items-center justify-center gap-2"
             >
               <LogOut size={18} />
               Sign Out
             </button>
             <button
               onClick={handleDeleteAccount}
               className="btn-danger w-full flex items-center justify-center gap-2"
             >
               <Trash2 size={18} />
               Delete Account
             </button>
           </div>
         </div>
       </div>
     </div>
     
     {/* Delete Account Confirmation Modal */}
     <ConfirmationModal
       isOpen={deleteModal}
       onClose={closeDeleteModal}
       onConfirm={confirmDeleteAccount}
       title="Delete Account"
       message="This action cannot be undone. Your account and all associated data including projects, endpoints, and usage history will be permanently deleted."
       confirmButtonText="Delete Account"
       type="danger"
       requiresTyping={true}
       requiredText="DELETE"
       isLoading={isDeleting}
       itemName={user?.email}
     />
   </div>
 );
};

export default Settings;