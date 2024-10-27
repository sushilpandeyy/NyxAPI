import React, { useState, useEffect } from 'react';
import axios from 'axios';
import nyx from '../assets/nyxLogo.webp';  // Importing the default template image
import Createproject from '../components/createproject';

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]); // Store fetched projects
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');

  const defaultImage = 'https://cdn4.vectorstock.com/i/1000x1000/71/28/square-loader-icon-circle-button-load-sign-symbol-vector-29007128.jpg'; // Default image if not uploaded

  // Retrieve user data from session storage and fetch projects
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData) {
      setUserId(userData.user_id);
      setUserName(userData.name);
      fetchProjects(userData.user_id);  // Fetch projects for the user
    } else {
      // Redirect to login if user data is not found
      window.location.href = '/login';
    }
  }, []);
  const handleCreateProject = async (e) => {
    e.preventDefault();

    // Convert image to base64 if uploaded
    let imageData = '';
    if (image) {
      imageData = await toBase64(image);
    } else {
      // Convert default image to base64
      imageData = await toBase64URL(defaultImage);
    }

    const formData = {
      title,
      userid: userId,
      Description: description,
      Img: imageData, // Base64 encoded image
    };

    try {
      // Include the token in the request headers for authentication
      const token = sessionStorage.getItem('token');
      const response = await axios.post('http://52.66.241.159/project/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.project_info) {
        console.log('Project created:', response.data.project_info);
        toggleModal();  // Close the modal after successful submission
        fetchProjects(userId);  // Refresh the list of projects
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    }
  };

  // Fetch projects for the given userId
  const fetchProjects = async (userId) => {
    try {
      const response = await axios.get(`http://52.66.241.159/project/?userid=${userId}`);
      if (response.data && response.data.Projects) {
        setProjects(response.data.Projects); // Set the projects array from response
        console.log(response.data.Projects)
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects.');
    }
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to handle form submission (for creating a project)
  

  // Function to handle image upload
  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  // Helper function to convert image file to base64
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  // Helper function to convert image URL to base64
  const toBase64URL = (url) => new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => toBase64(blob))
      .then(dataUrl => resolve(dataUrl))
      .catch(error => reject(error));
  });

  return (
    <>
      <div className="min-h-screen py-10 text-white bg-gray-900">
        <div className="px-6 mx-auto max-w-7xl">

          {/* Projects Section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Projects</h2>
            <button
              onClick={toggleModal}
              className="px-4 py-2 font-semibold text-white bg-pink-600 rounded hover:bg-pink-700"
            >
              + Create Project
            </button>
          </div>

          {/* Projects Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Map through the fetched projects */}
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="relative p-6 bg-gray-800 rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
                  onClick={() => window.location.href = `/dashboard/endpoints/${project.Projectid}`}
                >
                  <div className="flex items-center">
                    <img 
                      src={project.Img || defaultImage}
                      alt="Project Logo"
                      className="w-10 h-10 mr-3"
                    />
                    <h3 className="text-lg font-semibold">{project.Title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{project.Description}</p>
                  <p className="mt-1 text-sm text-gray-400">Created: {new Date(project.created).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No projects available.</p>
            )}

            {/* Create New Project Card */}
            <div
              onClick={toggleModal}
              className="flex items-center justify-center p-6 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <span className="text-xl">+ Create a new project</span>
            </div>
          </div>

          {/* Pagination and Project Count */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <label className="text-gray-400">Projects per page:</label>
              <select className="px-3 py-2 text-white bg-gray-800 rounded">
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
              </select>
              <span className="text-gray-400">Total results: {projects.length}</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-400">Prev</button>
              <span className="text-gray-400">1</span>
              <button className="text-gray-400">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for creating project */}
      {isModalOpen && (
        <Createproject toggleModal={toggleModal} />
      )}
    </>
  );
};

export default Projects;