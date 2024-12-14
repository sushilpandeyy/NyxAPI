import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus } from 'react-icons/fi';
import Createproject from '../components/createproject';

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState(null);

  const defaultImage = 'https://cdn4.vectorstock.com/i/1000x1000/71/28/square-loader-icon-circle-button-load-sign-symbol-vector-29007128.jpg';

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData) {
      setUserId(userData.id);
      fetchProjects(userData.id);   
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    let imageData = '';
    if (image) {
      imageData = await toBase64(image);
    } else {
      imageData = await toBase64URL(defaultImage);
    }

    const formData = {
      title,
      userid: userId,
      Description: description,
      Img: imageData,
    };

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/project/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.project_info) {
        toggleModal();
        fetchProjects(userId);
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    }
  };

  const fetchProjects = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/project/${userId}`);
      if (response.data) {
        console.log(response.data)
        setProjects(response.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="p-8 px-6 mx-auto bg-gray-900 rounded-lg shadow-lg max-w-7xl bg-opacity-90 backdrop-blur-lg">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-white">My Projects</h2>
          <button
            onClick={toggleModal}
            className="px-5 py-2 font-semibold text-white transition-all transform bg-indigo-600 rounded-full hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:shadow-lg focus:outline-none"
          >
            + New Project
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
  projects.map((project, index) => (
    <div
      key={project.ID || `default-${index}`}
      className="relative p-6 transition-transform transform bg-gray-800 rounded-lg shadow-lg cursor-pointer bg-opacity-70 hover:scale-105 hover:rotate-1 hover:bg-gray-700 hover:shadow-lg hover:shadow-indigo-500/50"
      onClick={() => {
        if (project.ID) {
          window.location.href = `/dashboard/endpoints/${project.ID}`;
        } else {
          console.error('Project ID is undefined:', project);
        }
      }}
    >
      <div className="flex items-center mb-4">
        <img 
          src={project.Img || defaultImage}
          alt="Project Logo"
          className="object-cover w-12 h-12 mr-3 rounded-md shadow-md"
        />
        <h3 className="text-lg font-semibold text-white">{project.Title || 'Untitled Project'}</h3>
      </div>
      <p className="text-sm text-gray-400">{project.Description || 'No description available.'}</p>
      <p className="mt-1 text-xs text-gray-500">
        Created: {project.CreatedAt ? new Date(project.CreatedAt).toLocaleDateString() : 'N/A'}
      </p>
    </div>
  ))
) : (
  <p className="text-gray-400">No projects available.</p>
)}
          <div
            onClick={toggleModal}
            className="relative flex items-center justify-center p-6 transition bg-gray-800 rounded-lg shadow-lg cursor-pointer bg-opacity-70 hover:bg-gray-700 hover:shadow-indigo-500/50"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center mb-3 text-2xl text-gray-300 bg-gray-700 rounded-full shadow-lg w-14 h-14">
                <FiPlus />
              </div>
              <span className="text-lg font-semibold text-gray-300">Create New Project</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10 text-gray-400">
          <div className="flex items-center space-x-2">
            <label>Projects per page:</label>
            <select className="px-3 py-2 text-white bg-gray-800 rounded-lg focus:outline-none">
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
            </select>
            <span>Total results: {projects.length}</span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="px-3 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600">Prev</button>
            <span>1</span>
            <button className="px-3 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600">Next</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Createproject toggleModal={toggleModal} />
      )}
    </div>
  );
};

export default Projects;