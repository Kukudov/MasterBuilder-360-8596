import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Projects = () => {
  const { user } = useAuth();
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter projects based on user role
  const getFilteredProjects = () => {
    let filteredProjects = [];

    switch (user.role) {
      case 'admin':
      case 'manager':
        filteredProjects = projects;
        break;
      case 'investor':
        filteredProjects = projects.filter(p => p.investors.includes(user.id));
        break;
      case 'worker':
        filteredProjects = projects.filter(p => p.teamMembers.includes(user.id));
        break;
      default:
        filteredProjects = [];
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.status === filterStatus);
    }

    // Apply search filter
    if (searchTerm) {
      filteredProjects = filteredProjects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredProjects;
  };

  const filteredProjects = getFilteredProjects();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    budget: '',
    location: '',
    category: 'Commercial',
    priority: 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProject) {
      updateProject(editingProject.id, {
        ...formData,
        budget: parseFloat(formData.budget)
      });
      toast.success('Project updated successfully');
    } else {
      addProject({
        ...formData,
        budget: parseFloat(formData.budget),
        progress: 0,
        spent: 0,
        managerId: user.id,
        teamMembers: [],
        investors: []
      });
      toast.success('Project created successfully');
    }

    setShowModal(false);
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      budget: '',
      location: '',
      category: 'Commercial',
      priority: 'medium'
    });
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: project.budget.toString(),
      location: project.location,
      category: project.category,
      priority: project.priority
    });
    setShowModal(true);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      toast.success('Project deleted successfully');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'completed': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-black';
      case 'planning': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getBudgetSize = (budget) => {
    if (budget < 1000000) return 'small';
    if (budget < 10000000) return 'medium';
    return 'large';
  };

  const getBudgetColor = (budget) => {
    const size = getBudgetSize(budget);
    switch (size) {
      case 'small': return 'text-orange-400';
      case 'medium': return 'text-blue-400';
      case 'large': return 'text-green-400';
      default: return 'text-white';
    }
  };

  const getBudgetIcon = (budget) => {
    const size = getBudgetSize(budget);
    switch (size) {
      case 'small': return FiIcons.FiDollarSign;
      case 'medium': return FiIcons.FiTrendingUp;
      case 'large': return FiIcons.FiStar;
      default: return FiIcons.FiDollarSign;
    }
  };

  const formatBudget = (budget) => {
    if (budget < 1000000) {
      return `$${(budget / 1000).toFixed(0)}K`;
    }
    return `$${(budget / 1000000).toFixed(1)}M`;
  };

  const canManageProjects = user.role === 'admin' || user.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        {canManageProjects && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiIcons.FiPlus} className="h-4 w-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <SafeIcon icon={FiIcons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="planning">Planning</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-gray-800 rounded-lg p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{project.description}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <SafeIcon icon={FiIcons.FiMapPin} className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{project.location}</span>
                </div>
              </div>
              {canManageProjects && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <SafeIcon icon={FiIcons.FiEdit} className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <SafeIcon icon={FiIcons.FiTrash} className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority} priority
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-400">Budget</span>
                <div className="flex items-center space-x-1">
                  <SafeIcon 
                    icon={getBudgetIcon(project.budget)} 
                    className={`h-4 w-4 ${getBudgetColor(project.budget)}`} 
                  />
                  <span className={`font-medium ${getBudgetColor(project.budget)}`}>
                    {formatBudget(project.budget)}
                  </span>
                  {getBudgetSize(project.budget) === 'small' && (
                    <span className="text-xs text-orange-300 bg-orange-900 px-1 rounded">
                      Small
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Spent</span>
                <span className="text-white">{formatBudget(project.spent)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">End Date</span>
                <span className="text-white">{format(new Date(project.endDate), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiIcons.FiFolder} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
          <p className="text-gray-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Get started by creating your first project'
            }
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProject(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Budget ($)
                </label>
                <input
                  type="number"
                  required
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 500000 for small projects"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Small: &lt;$1M, Medium: $1M-$10M, Large: &gt;$10M
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProject(null);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;