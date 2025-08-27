import React, { useState, useEffect } from 'react';
import { Client, Storage, ID } from "appwrite";
import { Upload, Image, X, FolderPlus } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const client = new Client()
 .setEndpoint("https://cloud.appwrite.io/v1")
 .setProject("6701847e00238051af38");

const storage = new Storage(client);

const CreateProject = ({ toggleModal, onProjectCreated }) => {
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 const [imageUrl, setImageUrl] = useState('');
 const [error, setError] = useState('');
 const [userId, setUserId] = useState(null);
 const [loading, setLoading] = useState(false);
 const [uploadingImage, setUploadingImage] = useState(false);

 useEffect(() => {
   const user = JSON.parse(sessionStorage.getItem('user'));
   if (!user) {
     setError('Not authenticated');
     return;
   }
   setUserId(user.user_id);
 }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();
   if (!userId) {
     setError('User not found');
     return;
   }

   setLoading(true);
   setError('');

   try {
     const response = await fetch(API_ENDPOINTS.PROJECTS, {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
       },
       body: JSON.stringify({
         title,
         userid: userId,
         Description: description,
         Img: imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop&crop=focalpoint'
       })
     });

     if (response.ok) {
       onProjectCreated?.();
       toggleModal();
     } else {
       throw new Error('Failed to create project');
     }
   } catch (err) {
     console.error('Project creation error:', err);
     setError('Failed to create project. Please try again.');
   } finally {
     setLoading(false);
   }
 };

 const handleImageUpload = async (e) => {
   const file = e.target.files[0];
   if (!file) return;

   // Validate file type
   if (!file.type.startsWith('image/')) {
     setError('Please select a valid image file');
     return;
   }

   // Validate file size (5MB max)
   if (file.size > 5 * 1024 * 1024) {
     setError('Image size must be less than 5MB');
     return;
   }

   setUploadingImage(true);
   setError('');

   try {
     const result = await storage.createFile("67149cce000047ac5262", ID.unique(), file);
     setImageUrl(`https://cloud.appwrite.io/v1/storage/buckets/67149cce000047ac5262/files/${result.$id}/view?project=6701847e00238051af38`);
   } catch (err) {
     console.error('Image upload error:', err);
     setError('Failed to upload image. Please try again.');
   } finally {
     setUploadingImage(false);
   }
 };

 return (
   <div className="modal-overlay" onClick={toggleModal}>
     <div className="card max-w-lg w-full animate-slide-in" onClick={(e) => e.stopPropagation()}>
       {/* Header */}
       <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-3">
           <FolderPlus size={24} className="text-primary-400" />
           <h2 className="heading-3">Create New Project</h2>
         </div>
         <button onClick={toggleModal} className="btn-ghost p-2">
           <X size={20} />
         </button>
       </div>

       {/* Form */}
       <form onSubmit={handleSubmit} className="space-y-6">
         <div>
           <label className="form-label">Project Title</label>
           <input
             type="text"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             className="form-input"
             placeholder="Enter project name"
             required
             maxLength={50}
           />
           <p className="text-muted text-xs mt-1">{title.length}/50 characters</p>
         </div>

         <div>
           <label className="form-label">Description</label>
           <textarea
             value={description}
             onChange={(e) => setDescription(e.target.value)}
             className="form-input resize-none h-24"
             placeholder="Brief description of your project"
             required
             maxLength={200}
           />
           <p className="text-muted text-xs mt-1">{description.length}/200 characters</p>
         </div>

         <div>
           <label className="form-label">Project Image (Optional)</label>
           <div className="space-y-4">
             {/* Image Preview */}
             {imageUrl && (
               <div className="relative">
                 <img 
                   src={imageUrl} 
                   alt="Project preview" 
                   className="w-full h-32 object-cover rounded-lg border border-dark-700"
                 />
                 <button
                   type="button"
                   onClick={() => setImageUrl('')}
                   className="absolute top-2 right-2 p-1 bg-dark-900/80 rounded-full hover:bg-dark-800"
                 >
                   <X size={16} />
                 </button>
               </div>
             )}
             
             {/* Upload Button */}
             <div className="relative">
               <input
                 type="file"
                 onChange={handleImageUpload}
                 accept="image/*"
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 disabled={uploadingImage}
               />
               <div className="btn-secondary w-full flex items-center justify-center gap-2 py-4 border-dashed border-2 hover:border-primary-600">
                 {uploadingImage ? (
                   <>
                     <div className="spinner w-4 h-4"></div>
                     <span>Uploading...</span>
                   </>
                 ) : (
                   <>
                     <Upload size={18} />
                     <span>Upload Project Image</span>
                   </>
                 )}
               </div>
             </div>
             <p className="text-muted text-xs">
               Supported formats: JPG, PNG, GIF. Max size: 5MB
             </p>
           </div>
         </div>

         {/* Error Message */}
         {error && (
           <div className="status-error p-3 rounded-lg">
             {error}
           </div>
         )}

         {/* Actions */}
         <div className="flex gap-3 pt-4">
           <button
             type="button"
             onClick={toggleModal}
             className="btn-secondary flex-1"
           >
             Cancel
           </button>
           <button
             type="submit"
             disabled={loading || uploadingImage || !userId}
             className="btn-primary flex-1 flex items-center justify-center gap-2"
           >
             {loading && <div className="spinner w-4 h-4"></div>}
             {loading ? 'Creating...' : 'Create Project'}
           </button>
         </div>
       </form>
     </div>
   </div>
 );
};

export default CreateProject;