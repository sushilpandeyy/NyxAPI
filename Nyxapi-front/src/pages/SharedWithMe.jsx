import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SharedWithMe = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');

  const defaultImage = 'https://cdn4.vectorstock.com/i/1000x1000/71/28/square-loader-icon-circle-button-load-sign-symbol-vector-29007128.jpg';

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData) {
      setUserId(userData.user_id);
      setUserName(userData.name);
      fetchProjects(userData.user_id);
    } else {
      // Redirect to login if user data is not found
      window.location.href = '/login';
    }
  }, []);

  const fetchProjects = async (userId) => {
    try {
      const response = await axios.get(`http://52.66.241.159/share/?userid=${userId}`);
      setProjects(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects.');
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    let imageData = image ? await toBase64(image) : await toBase64URL(defaultImage);

    const formData = {
      title,
      userid: userId,
      Description: description,
      Img: imageData,
    };

    try {
      const token = sessionStorage.getItem('token');
      await axios.post('http://52.66.241.159/project/', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toggleModal();
      fetchProjects(userId);
      resetForm();
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
    }
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const toBase64URL = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return toBase64(blob);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
  };

  return (
    <div className="min-h-screen py-10 text-white bg-gray-900">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Shared with me</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.length ? (
            projects.map((project) => (
              <div
                key={project.id}
                className="relative p-6 bg-gray-800 rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
                onClick={() => (window.location.href = `/dashboard/endpoints/${project.Projectid}`)}
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
                <p className="mt-1 text-sm text-gray-400">Created by: {project.user.name}</p>
                <p className="mt-1 text-sm text-gray-400">
                  Created on: {new Date(project.created).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No shared projects available.</p>
          )}
        </div>

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
  );
};

export default SharedWithMe;
