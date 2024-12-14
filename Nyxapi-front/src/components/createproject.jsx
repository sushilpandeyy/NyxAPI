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
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const userData = sessionStorage.getItem('user');
        const storedToken = sessionStorage.getItem('token');
        if (userData) {
            const user = JSON.parse(userData);
            setUserId(user.user_id);
            setToken(storedToken);
        } else {
            setError('User is not authenticated.');
        }
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = {
            title: title,
            userid: userId,
            Description: description,
            Img: imageUrl
        };

        try {
            const response = await fetch("http://localhost:8080/project/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError('Failed to create project. Please try again.');
            } else {
                toggleModal();
                window.location.reload();
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setError('No file selected.');
            return;
        }

        setImage(file);
        setImageLoading(true);

        try {
            const promise = await storage.createFile(
                "67149cce000047ac5262",
                ID.unique(),
                file
            );
            setImageUrl(
                `https://cloud.appwrite.io/v1/storage/buckets/67149cce000047ac5262/files/${promise.$id}/view?project=6701847e00238051af38`
            );
        } catch (error) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setImageLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="w-1/3 p-6 bg-gray-900 rounded-lg shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-white">Create New Project</h3>
                <form onSubmit={handleCreateProject}>
                    <div className="mb-4">
                        <label className="block text-gray-400">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={toggleModal}
                            className="px-4 py-2 text-white transition duration-200 ease-in-out bg-gray-700 rounded hover:bg-gray-600 hover:text-gray-300"
                        >
                            Cancel
                        </button>
                        {imageUrl && (
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded transition duration-200 ease-in-out ${
                                    loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'
                                } text-white hover:text-gray-300`}
                                disabled={loading || imageLoading}
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
