import React, { useState } from 'react';
import { Client, Storage, ID } from "appwrite"; // Import Appwrite SDK
import axios from 'axios';

// Initialize Appwrite client
const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite endpoint
    .setProject("6701847e00238051af38"); // Appwrite project ID

const storage = new Storage(client);

const CreateProject = ({ toggleModal }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const formData = {
            title,
            userid: userId,
            Description: description,
            Img: imageUrl,
        };

        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/project/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data && response.data.project_info) {
                console.log('Project created:', response.data.project_info);
                toggleModal();
            }
        } catch (err) {
            console.error('Error creating project:', err);
            setError('Failed to create project. Please try again.');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        setImage(file);

        try {
            const promise = await storage.createFile(
                "67149cce000047ac5262",
                ID.unique(),
                file
            );
            console.log(promise);
            setImageUrl("https://cloud.appwrite.io/v1/storage/buckets/67149cce000047ac5262/files/"+promise.$id+"/view?project=6701847e00238051af38");
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg w-1/3">
                <h3 className="text-xl font-semibold text-white mb-4">Create New Project</h3>
                <form onSubmit={handleCreateProject}>
                    <div className="mb-4">
                        <label className="block text-gray-400">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 mt-1 bg-gray-700 text-white rounded focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 mt-1 bg-gray-700 text-white rounded focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="block w-full mt-1 text-white"
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={toggleModal}
                            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateProject;
