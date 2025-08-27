import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, FolderPlus, Calendar, AlertCircle, Trash2, MoreVertical } from 'lucide-react';
import Createproject from '../components/createproject';
import ConfirmationModal from '../components/ConfirmationModal';
import { API_ENDPOINTS } from '../config/api';

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, project: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const defaultImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop&crop=focalpoint';

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setUserId(user.user_id);
    fetchProjects(user.user_id);
  }, []);

  const fetchProjects = async (userId) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_ENDPOINTS.PROJECTS}?userid=${userId}`);
      
      if (response.data?.Projects) {
        setProjects(response.data.Projects);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId) => {
    window.location.href = `/dashboard/endpoints/${projectId}`;
  };

  const handleDeleteProject = (project, e) => {
    e.stopPropagation(); // Prevent triggering project click
    setDeleteModal({ isOpen: true, project });
  };

  const confirmDeleteProject = async () => {
    if (!deleteModal.project) return;
    
    try {
      setIsDeleting(true);
      setError('');
      
      const response = await axios.delete(`${API_ENDPOINTS.PROJECTS}/${deleteModal.project.Projectid}?user_id=${userId}`);
      
      if (response.status === 200) {
        // Remove the project from the local state
        setProjects(projects.filter(p => p.Projectid !== deleteModal.project.Projectid));
        setDeleteModal({ isOpen: false, project: null });
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.response?.data?.detail || 'Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({ isOpen: false, project: null });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="spinner w-8 h-8 text-primary-500"></div>
          <p className="mt-4 text-dark-300">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-2">My Projects</h1>
          <p className="text-body mt-2">
            Manage your API projects and create new ones.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="status-error p-4 rounded-lg mb-6 flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project.Projectid)}
              onDelete={(e) => handleDeleteProject(project, e)}
              defaultImage={defaultImage}
            />
          ))
        ) : !loading && !error ? (
          <EmptyState onCreateProject={() => setIsModalOpen(true)} />
        ) : null}

        {/* Create Project Card */}
        {projects.length > 0 && (
          <div
            onClick={() => setIsModalOpen(true)}
            className="card-hover flex flex-col items-center justify-center min-h-[200px] border-dashed border-2 border-dark-600"
          >
            <FolderPlus size={32} className="text-primary-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Create New Project</h3>
            <p className="text-muted text-center">
              Start building your next API project
            </p>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <Createproject 
          toggleModal={() => setIsModalOpen(false)}
          onProjectCreated={() => {
            setIsModalOpen(false);
            fetchProjects(userId);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message="This action cannot be undone. All endpoints and data associated with this project will be permanently deleted."
        confirmButtonText="Delete Project"
        type="danger"
        requiresTyping={true}
        requiredText="DELETE"
        isLoading={isDeleting}
        itemName={deleteModal.project?.Title}
      />
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onClick, onDelete, defaultImage }) => (
  <div className="card-hover relative group">
    <div onClick={onClick} className="cursor-pointer">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-800">
          <img 
            src={project.Img || defaultImage}
            alt={project.Title}
            className="w-full h-full object-cover"
            onError={(e) => {e.target.src = defaultImage}}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="heading-4 truncate">{project.Title}</h3>
          <p className="text-muted text-xs">
            Project ID: {project.Projectid}
          </p>
        </div>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-dark-400 hover:text-error-400 hover:bg-dark-800 rounded-lg"
          title="Delete project"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <p className="text-body mb-4 line-clamp-2">
        {project.Description || 'No description provided'}
      </p>
      
      <div className="flex items-center gap-2 text-muted text-sm">
        <Calendar size={14} />
        <span>Created {new Date(project.created).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ onCreateProject }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16">
    <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-6">
      <FolderPlus size={32} className="text-dark-400" />
    </div>
    <h3 className="heading-3 mb-4">No projects yet</h3>
    <p className="text-body text-center mb-8 max-w-md">
      Create your first project to start building and managing mock APIs for your applications.
    </p>
    <button onClick={onCreateProject} className="btn-primary flex items-center gap-2">
      <Plus size={18} />
      Create Your First Project
    </button>
  </div>
);

export default Projects;