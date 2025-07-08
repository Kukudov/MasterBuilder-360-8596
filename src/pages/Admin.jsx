import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { users } from '../data/users';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Admin = () => {
  const { user } = useAuth();
  const { projects, tasks } = useData();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordResetUser, setPasswordResetUser] = useState(null);
  const [usersData, setUsersData] = useState(users);

  // User form state
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'worker',
    password: '',
    avatar: ''
  });

  // Password reset form state
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
    sendEmail: true
  });

  // Filter users based on search and role
  const getFilteredUsers = () => {
    let filteredUsers = usersData;

    if (filterRole !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.role === filterRole);
    }

    if (searchTerm) {
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredUsers;
  };

  const filteredUsers = getFilteredUsers();

  // Handle user form submission
  const handleUserSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      const updatedUsers = usersData.map(u => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              name: userForm.name,
              email: userForm.email,
              role: userForm.role,
              avatar: userForm.avatar || u.avatar
            }
          : u
      );
      setUsersData(updatedUsers);
      toast.success('User updated successfully');
    } else {
      // Create new user
      const newUser = {
        id: `usr-${Date.now()}`,
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        avatar: userForm.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
        permissions: getPermissionsByRole(userForm.role)
      };
      setUsersData([...usersData, newUser]);
      toast.success('User created successfully');
    }

    // Reset form
    setUserForm({
      name: '',
      email: '',
      role: 'worker',
      password: '',
      avatar: ''
    });
    setShowUserModal(false);
    setEditingUser(null);
  };

  // Handle password reset submission
  const handlePasswordReset = (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    // Update user password
    const updatedUsers = usersData.map(u => 
      u.id === passwordResetUser.id 
        ? { ...u, password: passwordForm.newPassword }
        : u
    );
    setUsersData(updatedUsers);

    // Show success message based on email option
    if (passwordForm.sendEmail) {
      toast.success(`Password reset successfully. Email sent to ${passwordResetUser.email}`);
    } else {
      toast.success(`Password reset successfully for ${passwordResetUser.name}`);
    }

    // Reset form and close modal
    setPasswordForm({
      newPassword: '',
      confirmPassword: '',
      sendEmail: true
    });
    setShowPasswordModal(false);
    setPasswordResetUser(null);
  };

  // Generate random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordForm({ ...passwordForm, newPassword: password, confirmPassword: password });
  };

  // Get permissions based on role
  const getPermissionsByRole = (role) => {
    switch (role) {
      case 'admin':
        return ['all'];
      case 'manager':
        return ['projects', 'tasks', 'scheduling', 'budget', 'documents', 'reports', 'team'];
      case 'investor':
        return ['projects_readonly', 'reports_readonly', 'budget_readonly'];
      case 'worker':
        return ['tasks_assigned', 'time_tracking', 'daily_reports'];
      default:
        return [];
    }
  };

  // Handle user edit
  const handleUserEdit = (userData) => {
    setEditingUser(userData);
    setUserForm({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      password: '',
      avatar: userData.avatar
    });
    setShowUserModal(true);
  };

  // Handle password reset modal
  const handlePasswordResetModal = (userData) => {
    setPasswordResetUser(userData);
    setPasswordForm({
      newPassword: '',
      confirmPassword: '',
      sendEmail: true
    });
    setShowPasswordModal(true);
  };

  // Handle user disable/enable
  const handleUserToggle = (userId) => {
    const userData = usersData.find(u => u.id === userId);
    const updatedUsers = usersData.map(u => 
      u.id === userId 
        ? { ...u, disabled: !u.disabled }
        : u
    );
    setUsersData(updatedUsers);
    toast.success(`User ${userData.disabled ? 'enabled' : 'disabled'} successfully`);
  };

  // Handle user delete
  const handleUserDelete = (userId) => {
    const userData = usersData.find(u => u.id === userId);
    if (window.confirm(`Are you sure you want to delete user: ${userData.name}?`)) {
      const updatedUsers = usersData.filter(u => u.id !== userId);
      setUsersData(updatedUsers);
      toast.success(`User deleted: ${userData.name}`);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500 text-white';
      case 'manager': return 'bg-blue-500 text-white';
      case 'investor': return 'bg-green-500 text-white';
      case 'worker': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'planning': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const systemStats = [
    {
      title: 'Total Users',
      value: usersData.length,
      icon: FiIcons.FiUsers,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Projects',
      value: projects.filter(p => p.status === 'active').length,
      icon: FiIcons.FiFolder,
      color: 'bg-green-500'
    },
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: FiIcons.FiCheckSquare,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Budget',
      value: `$${(projects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M`,
      icon: FiIcons.FiDollarSign,
      color: 'bg-yellow-500'
    }
  ];

  const usersByRole = {
    admin: usersData.filter(u => u.role === 'admin').length,
    manager: usersData.filter(u => u.role === 'manager').length,
    investor: usersData.filter(u => u.role === 'investor').length,
    worker: usersData.filter(u => u.role === 'worker').length
  };

  const recentActivity = [
    { action: 'User login', user: 'John Mitchell', time: '2 minutes ago', type: 'login' },
    { action: 'Project created', user: 'Sarah Johnson', time: '15 minutes ago', type: 'project' },
    { action: 'Task completed', user: 'Carlos Martinez', time: '1 hour ago', type: 'task' },
    { action: 'Report generated', user: 'Emily Rodriguez', time: '2 hours ago', type: 'report' },
    { action: 'Document uploaded', user: 'Michael Chen', time: '3 hours ago', type: 'document' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return FiIcons.FiLogIn;
      case 'project': return FiIcons.FiFolder;
      case 'task': return FiIcons.FiCheckSquare;
      case 'report': return FiIcons.FiFileText;
      case 'document': return FiIcons.FiFile;
      default: return FiIcons.FiActivity;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiIcons.FiBarChart },
    { id: 'users', name: 'User Management', icon: FiIcons.FiUsers },
    { id: 'projects', name: 'Project Overview', icon: FiIcons.FiFolder },
    { id: 'activity', name: 'Activity Log', icon: FiIcons.FiActivity },
    { id: 'system', name: 'System Settings', icon: FiIcons.FiSettings }
  ];

  // Only allow admin access
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <SafeIcon icon={FiIcons.FiShield} className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Access Denied</h3>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">System administration and user management</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <SafeIcon icon={tab.icon} className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemStats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} rounded-full p-3`}>
                    <SafeIcon icon={stat.icon} className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* User Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Users by Role</h3>
              <div className="space-y-3">
                {Object.entries(usersByRole).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(role)}`}>
                        {role}
                      </span>
                      <span className="text-white capitalize">{role}</span>
                    </div>
                    <span className="text-gray-400">{count} users</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Project Status</h3>
              <div className="space-y-3">
                {['active', 'completed', 'pending', 'planning'].map((status) => {
                  const count = projects.filter(p => p.status === status).length;
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                        <span className="text-white capitalize">{status}</span>
                      </div>
                      <span className="text-gray-400">{count} projects</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Header with Add User Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-white">User Management</h2>
            <button
              onClick={() => setShowUserModal(true)}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <SafeIcon icon={FiIcons.FiUserPlus} className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SafeIcon icon={FiIcons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="investor">Investor</option>
              <option value="worker">Worker</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((userData) => (
                    <tr key={userData.id} className="bg-gray-800 border-b border-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={userData.avatar}
                            alt={userData.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="font-medium text-white">{userData.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(userData.role)}`}>
                          {userData.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">{userData.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          userData.disabled ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {userData.disabled ? 'Disabled' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUserEdit(userData)}
                            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                            title="Edit User"
                          >
                            <SafeIcon icon={FiIcons.FiEdit} className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePasswordResetModal(userData)}
                            className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
                            title="Reset Password"
                          >
                            <SafeIcon icon={FiIcons.FiKey} className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUserToggle(userData.id)}
                            className={`p-1 transition-colors ${
                              userData.disabled 
                                ? 'text-gray-400 hover:text-green-400' 
                                : 'text-gray-400 hover:text-yellow-400'
                            }`}
                            title={userData.disabled ? 'Enable User' : 'Disable User'}
                          >
                            <SafeIcon icon={userData.disabled ? FiIcons.FiUserCheck : FiIcons.FiUserMinus} className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUserDelete(userData.id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <SafeIcon icon={FiIcons.FiTrash} className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">All Projects Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Project Name</th>
                    <th className="px-6 py-3">Manager</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Progress</th>
                    <th className="px-6 py-3">Budget</th>
                    <th className="px-6 py-3">Team Size</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => {
                    const manager = usersData.find(u => u.id === project.managerId);
                    return (
                      <tr key={project.id} className="bg-gray-800 border-b border-gray-700">
                        <td className="px-6 py-4 font-medium text-white">{project.name}</td>
                        <td className="px-6 py-4">{manager?.name || 'Unknown'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'active' ? 'bg-green-500 text-white' :
                            project.status === 'completed' ? 'bg-blue-500 text-white' :
                            project.status === 'pending' ? 'bg-yellow-500 text-black' :
                            'bg-purple-500 text-white'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{project.progress}%</td>
                        <td className="px-6 py-4">${(project.budget / 1000000).toFixed(1)}M</td>
                        <td className="px-6 py-4">{project.teamMembers.length + project.investors.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <div className="p-2 bg-gray-600 rounded-full">
                    <SafeIcon icon={getActivityIcon(activity.type)} className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-400">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Maintenance Mode</h4>
                  <p className="text-sm text-gray-400">Put the system in maintenance mode</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-400">System-wide email notifications</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Auto Backup</h4>
                  <p className="text-sm text-gray-400">Automatic daily database backups</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Version</p>
                <p className="text-white font-medium">MasterBuilder 360 v1.0.0</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Update</p>
                <p className="text-white font-medium">{format(new Date(), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Database</p>
                <p className="text-white font-medium">PostgreSQL 14.2</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Storage Used</p>
                <p className="text-white font-medium">2.4 GB / 10 GB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                  setUserForm({
                    name: '',
                    email: '',
                    role: 'worker',
                    password: '',
                    avatar: ''
                  });
                }}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="worker">Worker</option>
                  <option value="manager">Manager</option>
                  <option value="investor">Investor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Avatar URL (Optional)
                </label>
                <input
                  type="url"
                  value={userForm.avatar}
                  onChange={(e) => setUserForm({ ...userForm, avatar: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
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

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Reset Password</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordResetUser(null);
                  setPasswordForm({
                    newPassword: '',
                    confirmPassword: '',
                    sendEmail: true
                  });
                }}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>

            {passwordResetUser && (
              <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={passwordResetUser.avatar}
                    alt={passwordResetUser.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">{passwordResetUser.name}</p>
                    <p className="text-sm text-gray-400">{passwordResetUser.email}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-300">
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Generate Random
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={passwordForm.sendEmail}
                  onChange={(e) => setPasswordForm({ ...passwordForm, sendEmail: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="sendEmail" className="text-sm text-gray-300">
                  Send password reset email to user
                </label>
              </div>

              {passwordForm.newPassword && passwordForm.newPassword.length < 8 && (
                <div className="text-red-400 text-sm">
                  Password must be at least 8 characters long
                </div>
              )}

              {passwordForm.newPassword && passwordForm.confirmPassword && 
               passwordForm.newPassword !== passwordForm.confirmPassword && (
                <div className="text-red-400 text-sm">
                  Passwords do not match
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordResetUser(null);
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

export default Admin;