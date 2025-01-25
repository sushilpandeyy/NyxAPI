import React, { useState, useEffect } from 'react';
import { Client, Storage, ID } from "appwrite";
import axios from 'axios';

const client = new Client()
 .setEndpoint("https://cloud.appwrite.io/v1")
 .setProject("6701847e00238051af38");

const storage = new Storage(client);

const CreateProject = ({ toggleModal }) => {
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 const [imageUrl, setImageUrl] = useState('');
 const [error, setError] = useState('');
 const [userId, setUserId] = useState(null);
 const [loading, setLoading] = useState(false);

 useEffect(() => {
   const user = JSON.parse(sessionStorage.getItem('user'));
   if (!user) return setError('Not authenticated');
   setUserId(user.user_id);
 }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);

   try {
     await fetch("https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/project/", {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
       },
       body: JSON.stringify({
         title,
         userid: userId,
         Description: description,
         Img: imageUrl
       })
     });
     toggleModal();
     window.location.reload();
   } catch (err) {
     setError('Failed to create project');
   } finally {
     setLoading(false);
   }
 };

 const handleImageUpload = async (e) => {
   const file = e.target.files[0];
   if (!file) return;

   try {
     const result = await storage.createFile("67149cce000047ac5262", ID.unique(), file);
     setImageUrl(`https://cloud.appwrite.io/v1/storage/buckets/67149cce000047ac5262/files/${result.$id}/view?project=6701847e00238051af38`);
   } catch (err) {
     setError('Image upload failed');
   }
 };

 return (
   <div className="fixed inset-0 flex items-center justify-center bg-black/50">
     <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 max-w-md w-full">
       <h2 className="text-2xl font-bold text-white mb-6">New Project</h2>

       <form onSubmit={handleSubmit} className="space-y-6">
         <div>
           <label className="text-gray-400 mb-2 block">Title</label>
           <input
             type="text"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             className="w-full p-3 bg-gray-800 text-white rounded-lg"
             required
           />
         </div>

         <div>
           <label className="text-gray-400 mb-2 block">Description</label>
           <textarea
             value={description}
             onChange={(e) => setDescription(e.target.value)}  
             className="w-full p-3 bg-gray-800 text-white rounded-lg"
             required
           />
         </div>

         <div>
           <label className="text-gray-400 mb-2 block">Image</label>
           <input
             type="file"
             onChange={handleImageUpload}
             accept="image/*"
             className="w-full text-gray-400"
           />
         </div>

         {error && <p className="text-red-500">{error}</p>}

         <div className="flex gap-4 justify-end">
           <button
             type="button"
             onClick={toggleModal}
             className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
           >
             Cancel
           </button>
           {imageUrl && (
             <button
               type="submit"
               disabled={loading}
               className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
             >
               {loading ? 'Creating...' : 'Create'}
             </button>
           )}
         </div>
       </form>
     </div>
   </div>
 );
};

export default CreateProject;