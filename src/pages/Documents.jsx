import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Documents = () => {
  const { user } = useAuth();
  const { projects, documents, addDocument, deleteDocument } = useData();
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Filter documents based on user role
  const getFilteredDocuments = () => {
    let filteredDocs = [];

    switch (user.role) {
      case 'admin':
      case 'manager':
        filteredDocs = documents;
        break;
      case 'investor':
        const investorProjects = projects.filter(p => p.investors.includes(user.id));
        filteredDocs = documents.filter(d => 
          investorProjects.some(p => p.id === d.projectId)
        );
        break;
      default:
        filteredDocs = [];
    }

    // Apply filters
    if (filterCategory !== 'all') {
      filteredDocs = filteredDocs.filter(d => d.category === filterCategory);
    }

    if (filterProject !== 'all') {
      filteredDocs = filteredDocs.filter(d => d.projectId === filterProject);
    }

    if (searchTerm) {
      filteredDocs = filteredDocs.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredDocs;
  };

  const filteredDocuments = getFilteredDocuments();

  const [formData, setFormData] = useState({
    name: '',
    type: 'document',
    projectId: '',
    category: 'Design',
    format: 'PDF'
  });

  // File upload handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setFormData({ 
        ...formData, 
        name: file.name.split('.')[0],
        format: file.name.split('.').pop().toUpperCase()
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      setFormData({ 
        ...formData, 
        name: file.name.split('.')[0],
        format: file.name.split('.').pop().toUpperCase()
      });
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!uploadedFile && !formData.name) {
      toast.error('Please select a file or enter a document name');
      return;
    }

    const documentData = {
      ...formData,
      uploadedBy: user.id,
      size: uploadedFile ? formatFileSize(uploadedFile.size) : '2.5 MB',
      url: '#'
    };

    addDocument(documentData);
    toast.success('Document uploaded successfully');
    
    // Reset form
    setShowModal(false);
    setFormData({
      name: '',
      type: 'document',
      projectId: '',
      category: 'Design',
      format: 'PDF'
    });
    setUploadedFile(null);
  };

  const handleDelete = (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(documentId);
      toast.success('Document deleted successfully');
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getFileIcon = (format) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return FiIcons.FiFile;
      case 'docx':
      case 'doc':
        return FiIcons.FiFileText;
      case 'xlsx':
      case 'xls':
        return FiIcons.FiGrid;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return FiIcons.FiImage;
      default:
        return FiIcons.FiFile;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Design': return 'bg-blue-500';
      case 'Safety': return 'bg-red-500';
      case 'Materials': return 'bg-green-500';
      case 'Legal': return 'bg-purple-500';
      case 'Environmental': return 'bg-teal-500';
      case 'Quality Control': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const canManageDocuments = user.role === 'admin' || user.role === 'manager';
  const categories = ['Design', 'Safety', 'Materials', 'Legal', 'Environmental', 'Quality Control', 'Engineering', 'Traffic', 'Equipment', 'Planning'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Documents</h1>
        {canManageDocuments && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiIcons.FiUpload} className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <SafeIcon icon={FiIcons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="bg-gray-800 rounded-lg p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <SafeIcon icon={getFileIcon(document.format)} className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{document.name}</h3>
                  <p className="text-sm text-gray-400">{document.format} • {document.size}</p>
                </div>
              </div>
              {canManageDocuments && (
                <button
                  onClick={() => handleDelete(document.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <SafeIcon icon={FiIcons.FiTrash} className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(document.category)} text-white`}>
                  {document.category}
                </span>
                <span className="text-xs text-gray-400 capitalize">{document.type}</span>
              </div>

              <div className="border-t border-gray-700 pt-3">
                <p className="text-sm text-gray-400 mb-2">Project</p>
                <p className="text-sm text-white">{getProjectName(document.projectId)}</p>
              </div>

              <div className="border-t border-gray-700 pt-3">
                <p className="text-sm text-gray-400 mb-2">Uploaded</p>
                <p className="text-sm text-white">{format(new Date(document.uploadedAt), 'MMM dd, yyyy')}</p>
              </div>

              <div className="border-t border-gray-700 pt-3">
                <button
                  onClick={() => toast.success('Document download started')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <SafeIcon icon={FiIcons.FiDownload} className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiIcons.FiFile} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No documents found</h3>
          <p className="text-gray-400">
            {searchTerm || filterCategory !== 'all' || filterProject !== 'all'
              ? 'Try adjusting your filters'
              : 'Upload your first document to get started'
            }
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Upload Document</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setUploadedFile(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Document Name
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
                  Project
                </label>
                <select
                  required
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="document">Document</option>
                    <option value="blueprint">Blueprint</option>
                    <option value="specification">Specification</option>
                    <option value="report">Report</option>
                    <option value="contract">Contract</option>
                    <option value="permit">Permit</option>
                    <option value="manual">Manual</option>
                    <option value="proposal">Proposal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                    <option value="JPG">JPG</option>
                    <option value="PNG">PNG</option>
                  </select>
                </div>
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
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  File Upload
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50 bg-opacity-10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleFileUploadClick}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png,.doc,.xls"
                  />
                  
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <SafeIcon icon={FiIcons.FiCheckCircle} className="h-8 w-8 text-green-400 mx-auto" />
                      <p className="text-sm text-green-400 font-medium">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-400">{formatFileSize(uploadedFile.size)}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                          setFormData({ ...formData, name: '', format: 'PDF' });
                        }}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <SafeIcon icon={FiIcons.FiUpload} className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOCX, XLSX, JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Upload Document
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setUploadedFile(null);
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

export default Documents;