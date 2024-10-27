import React, { useState, useEffect } from 'react';
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
    const [userId, setUserId] = useState(null); // Set userId accordingly
    const [loading, setLoading] = useState(false); // Loading state
    const [imageLoading, setImageLoading] = useState(false); // Loading state for image upload
    const [token, setToken] = useState(''); // Token for authorization

    useEffect(() => {
        // Retrieve user data from sessionStorage
        const userData = sessionStorage.getItem('user');
        const storedToken = sessionStorage.getItem('token'); // Retrieve token from sessionStorage

        if (userData) {
            const user = JSON.parse(userData);
            console.log(user.user_id); // Log userId
            setUserId(user.user_id); // Set userId state
            setToken(storedToken); // Set token state
        } else {
            setError('User is not authenticated.');
        }
    }, []); // Run only once when the component mounts

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Update formData with the current component state
        const formData = {
            title: title,
            userid: userId,
            Description: description,
            Img: imageUrl  // use imageUrl from state after the image is uploaded
        };

        console.log("Sending project data:", formData);  // Log the data being sent

        try {
            const response = await fetch("http://52.66.241.159/project/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,  // Assuming you have token-based auth
                },
                body: JSON.stringify(formData),  // Send the correct project data
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError('Failed to create project. Please try again.');
                console.error("Error response from server:", errorData);
            } else {
                const data = await response.json();
                console.log("Project created:", data);
                setError('');  // Clear any previous error
                toggleModal();  // Close the modal
                window.location.reload(); // Reload the page
            }
        } catch (error) {
            console.error("Error creating project:", error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]; // Get the selected file
        
        if (!file) {
            setError('No file selected.');
            return;
        }

        setImage(file);
        setImageLoading(true); // Set image loading state

        try {
            const promise = await storage.createFile(
                "67149cce000047ac5262", // Your bucket ID
                ID.unique(),
                file
            );
            console.log(promise);
            setImageUrl(
                `https://cloud.appwrite.io/v1/storage/buckets/67149cce000047ac5262/files/${promise.$id}/view?project=6701847e00238051af38`
            );
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image. Please try again.'); // Update error message
        } finally {
            setImageLoading(false); // Reset loading state after upload
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
                        {/* Show Create button only if the image has been uploaded */}
                        {imageUrl && (
                            <button
                                type="submit"
                                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                                disabled={loading || imageLoading} // Disable button when loading
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
