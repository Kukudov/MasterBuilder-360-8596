import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ReactECharts from 'echarts-for-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { projects, tasks, reports, addProject, addTask, addDocument, addReport } = useData();
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('progress');
  const [hoveredStat, setHoveredStat] = useState(null);
  const [showQuickProjectModal, setShowQuickProjectModal] = useState(false);
  const [showQuickTaskModal, setShowQuickTaskModal] = useState(false);
  const [showQuickDocumentModal, setShowQuickDocumentModal] = useState(false);
  const [showQuickReportModal, setShowQuickReportModal] = useState(false);
  const navigate = useNavigate();

  // Quick forms state
  const [quickProjectForm, setQuickProjectForm] = useState({
    name: '',
    description: '',
    location: '',
    budget: '',
    startDate: '',
    endDate: ''
  });

  const [quickTaskForm, setQuickTaskForm] = useState({
    title: '',
    description: '',
    projectId: '',
    estimatedHours: '',
    startDate: '',
    endDate: ''
  });

  const [quickDocumentForm, setQuickDocumentForm] = useState({
    name: '',
    projectId: '',
    type: 'document',
    category: 'Design'
  });

  const [quickReportForm, setQuickReportForm] = useState({
    title: '',
    type: 'progress',
    projectId: ''
  });

  // Filter data based on user role
  const getFilteredData = () => {
    switch (user.role) {
      case 'admin':
        return { projects: projects, tasks: tasks, reports: reports };
      case 'manager':
        return { projects: projects, tasks: tasks, reports: reports };
      case 'investor':
        const investorProjects = projects.filter(p => p.investors.includes(user.id));
        return {
          projects: investorProjects,
          tasks: tasks.filter(t => investorProjects.some(p => p.id === t.projectId)),
          reports: reports.filter(r => investorProjects.some(p => p.id === r.projectId))
        };
      case 'worker':
        const workerTasks = tasks.filter(t => t.assignedTo === user.id);
        const workerProjects = projects.filter(p => p.teamMembers.includes(user.id));
        return {
          projects: workerProjects,
          tasks: workerTasks,
          reports: reports.filter(r => workerProjects.some(p => p.id === r.projectId))
        };
      default:
        return { projects: [], tasks: [], reports: [] };
    }
  };

  const filteredData = getFilteredData();

  // Quick Action Handlers
  const handleQuickProject = () => {
    if (user.role === 'admin' || user.role === 'manager') {
      setShowQuickProjectModal(true);
    } else {
      navigate('/projects');
    }
  };

  const handleQuickDocument = () => {
    if (user.role === 'admin' || user.role === 'manager') {
      setShowQuickDocumentModal(true);
    } else {
      navigate('/documents');
    }
  };

  const handleQuickReport = () => {
    if (user.role === 'admin' || user.role === 'manager') {
      setShowQuickReportModal(true);
    } else {
      navigate('/reports');
    }
  };

  const handleQuickTask = () => {
    if (user.role === 'admin' || user.role === 'manager') {
      setShowQuickTaskModal(true);
    } else {
      navigate('/schedule');
    }
  };

  // Form Handlers
  const handleQuickProjectSubmit = (e) => {
    e.preventDefault();
    
    const newProject = {
      ...quickProjectForm,
      budget: parseFloat(quickProjectForm.budget),
      status: 'planning',
      progress: 0,
      spent: 0,
      managerId: user.id,
      teamMembers: [],
      investors: [],
      category: 'Commercial',
      priority: 'medium'
    };

    addProject(newProject);
    toast.success('Project created successfully!');
    setShowQuickProjectModal(false);
    setQuickProjectForm({
      name: '',
      description: '',
      location: '',
      budget: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleQuickTaskSubmit = (e) => {
    e.preventDefault();
    
    const newTask = {
      ...quickTaskForm,
      estimatedHours: parseInt(quickTaskForm.estimatedHours),
      assignedTo: user.id,
      status: 'pending',
      progress: 0,
      actualHours: 0,
      priority: 'medium',
      category: 'Construction'
    };

    addTask(newTask);
    toast.success('Task created successfully!');
    setShowQuickTaskModal(false);
    setQuickTaskForm({
      title: '',
      description: '',
      projectId: '',
      estimatedHours: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleQuickDocumentSubmit = (e) => {
    e.preventDefault();
    
    const newDocument = {
      ...quickDocumentForm,
      uploadedBy: user.id,
      size: '2.5 MB',
      format: 'PDF',
      url: '#'
    };

    addDocument(newDocument);
    toast.success('Document created successfully!');
    setShowQuickDocumentModal(false);
    setQuickDocumentForm({
      name: '',
      projectId: '',
      type: 'document',
      category: 'Design'
    });
  };

  const handleQuickReportSubmit = (e) => {
    e.preventDefault();
    
    const project = projects.find(p => p.id === quickReportForm.projectId);
    const projectTasks = tasks.filter(t => t.projectId === quickReportForm.projectId);
    
    let generatedSummary = '';
    let generatedDetails = {};
    
    switch (quickReportForm.type) {
      case 'progress':
        const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
        const totalTasks = projectTasks.length;
        const avgProgress = project ? project.progress : 0;
        
        generatedDetails = {
          tasksCompleted: completedTasks,
          tasksTotal: totalTasks,
          overallProgress: avgProgress
        };
        
        generatedSummary = `Progress Report: ${project?.name || 'Project'} is ${avgProgress}% complete with ${completedTasks}/${totalTasks} tasks finished.`;
        break;
        
      case 'budget':
        const budgetUsed = project ? (project.spent / project.budget) * 100 : 0;
        generatedDetails = {
          budgetTotal: project?.budget || 0,
          budgetSpent: project?.spent || 0,
          percentageUsed: budgetUsed
        };
        
        generatedSummary = `Budget Analysis: ${budgetUsed.toFixed(1)}% of budget utilized.`;
        break;
        
      default:
        generatedSummary = `${quickReportForm.type} report generated for ${project?.name || 'project'}.`;
        generatedDetails = {
          generatedAt: new Date().toISOString(),
          reportType: quickReportForm.type
        };
    }

    const newReport = {
      ...quickReportForm,
      summary: generatedSummary,
      createdBy: user.id,
      status: 'completed',
      details: generatedDetails
    };

    addReport(newReport);
    toast.success('Report generated successfully!');
    setShowQuickReportModal(false);
    setQuickReportForm({
      title: '',
      type: 'progress',
      projectId: ''
    });
  };

  // Navigation handlers for "View All" buttons
  const handleViewAllProjects = () => {
    navigate('/projects');
  };

  const handleViewAllTasks = () => {
    navigate('/schedule');
  };

  const stats = [
    {
      title: 'Total Projects',
      value: filteredData.projects.length,
      icon: FiIcons.FiFolder,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up',
      details: {
        active: filteredData.projects.filter(p => p.status === 'active').length,
        completed: filteredData.projects.filter(p => p.status === 'completed').length,
        pending: filteredData.projects.filter(p => p.status === 'pending').length
      }
    },
    {
      title: 'Active Tasks',
      value: filteredData.tasks.filter(t => t.status === 'active').length,
      icon: FiIcons.FiCheckSquare,
      color: 'bg-green-500',
      change: '+8%',
      trend: 'up',
      details: {
        total: filteredData.tasks.length,
        completed: filteredData.tasks.filter(t => t.status === 'completed').length,
        overdue: filteredData.tasks.filter(t => {
          const taskEnd = new Date(t.endDate);
          return taskEnd < new Date() && t.status !== 'completed';
        }).length
      }
    },
    {
      title: 'Completed Tasks',
      value: filteredData.tasks.filter(t => t.status === 'completed').length,
      icon: FiIcons.FiCheck,
      color: 'bg-purple-500',
      change: '+15%',
      trend: 'up',
      details: {
        thisWeek: Math.floor(Math.random() * 10) + 5,
        thisMonth: filteredData.tasks.filter(t => t.status === 'completed').length,
        efficiency: Math.floor(Math.random() * 20) + 80
      }
    },
    {
      title: 'Total Budget',
      value: `$${(filteredData.projects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M`,
      icon: FiIcons.FiDollarSign,
      color: 'bg-yellow-500',
      change: '+5%',
      trend: 'up',
      details: {
        allocated: filteredData.projects.reduce((sum, p) => sum + p.budget, 0),
        spent: filteredData.projects.reduce((sum, p) => sum + p.spent, 0),
        remaining: filteredData.projects.reduce((sum, p) => sum + (p.budget - p.spent), 0)
      }
    }
  ];

  // Interactive chart data based on selected metric
  const getChartData = () => {
    const baseData = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        textStyle: { color: '#fff' }
      },
      legend: {
        textStyle: { color: '#fff' }
      },
      xAxis: {
        type: 'category',
        data: filteredData.projects.map(p => p.name.substring(0, 15) + '...'),
        axisLabel: { color: '#fff' }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#fff' }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        },
        iconStyle: { borderColor: '#fff' }
      }
    };

    switch (selectedMetric) {
      case 'progress':
        return {
          ...baseData,
          yAxis: { ...baseData.yAxis, max: 100 },
          series: [{
            name: 'Progress %',
            type: 'bar',
            data: filteredData.projects.map(p => p.progress),
            itemStyle: { color: '#3b82f6' },
            animationDelay: (idx) => idx * 100
          }]
        };
      case 'budget':
        return {
          ...baseData,
          legend: { data: ['Budget', 'Spent'], textStyle: { color: '#fff' } },
          series: [
            {
              name: 'Budget',
              type: 'bar',
              data: filteredData.projects.map(p => p.budget / 1000000),
              itemStyle: { color: '#3b82f6' }
            },
            {
              name: 'Spent',
              type: 'bar',
              data: filteredData.projects.map(p => p.spent / 1000000),
              itemStyle: { color: '#ef4444' }
            }
          ]
        };
      case 'timeline':
        return {
          ...baseData,
          series: [{
            name: 'Days Remaining',
            type: 'line',
            data: filteredData.projects.map(p => {
              const end = new Date(p.endDate);
              const now = new Date();
              return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
            }),
            itemStyle: { color: '#10b981' },
            smooth: true
          }]
        };
      default:
        return baseData;
    }
  };

  const projectStatusData = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1f2937',
      borderColor: '#374151',
      textStyle: { color: '#fff' }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#fff' }
    },
    series: [{
      name: 'Project Status',
      type: 'pie',
      radius: '50%',
      data: [
        { value: filteredData.projects.filter(p => p.status === 'active').length, name: 'Active' },
        { value: filteredData.projects.filter(p => p.status === 'completed').length, name: 'Completed' },
        { value: filteredData.projects.filter(p => p.status === 'pending').length, name: 'Pending' },
        { value: filteredData.projects.filter(p => p.status === 'planning').length, name: 'Planning' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0,0,0,0.5)'
        }
      }
    }]
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-800 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="text-sm text-gray-400 mr-2">Timeframe:</label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mr-2">Metric:</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="progress">Progress</option>
              <option value="budget">Budget</option>
              <option value="timeline">Timeline</option>
            </select>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          Last updated: {format(new Date(), 'MMM dd, HH:mm')}
        </div>
      </div>

      {/* Interactive Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 card-hover cursor-pointer transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setHoveredStat(index)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change} from last {selectedTimeframe}
                  </span>
                  <SafeIcon 
                    icon={stat.trend === 'up' ? FiIcons.FiTrendingUp : FiIcons.FiTrendingDown} 
                    className={`h-3 w-3 ml-1 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} 
                  />
                </div>
              </div>
              <div className={`${stat.color} rounded-full p-3 transition-transform duration-300 ${hoveredStat === index ? 'scale-110' : ''}`}>
                <SafeIcon icon={stat.icon} className="h-6 w-6 text-white" />
              </div>
            </div>
            
            {/* Detailed breakdown on hover */}
            {hoveredStat === index && (
              <div className="mt-4 pt-4 border-t border-gray-700 animate-fade-in">
                <div className="space-y-1 text-xs text-gray-400">
                  {Object.entries(stat.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}:</span>
                      <span className="text-white">{typeof value === 'number' && value > 1000000 ? `$${(value/1000000).toFixed(1)}M` : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Project Analysis</h3>
            <div className="flex space-x-2">
              <SafeIcon icon={FiIcons.FiBarChart} className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <ReactECharts 
            option={getChartData()} 
            style={{ height: '300px' }}
            opts={{ renderer: 'svg' }}
          />
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Project Status Distribution</h3>
            <SafeIcon icon={FiIcons.FiPieChart} className="h-5 w-5 text-purple-400" />
          </div>
          <ReactECharts 
            option={projectStatusData} 
            style={{ height: '300px' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      </div>

      {/* Recent Projects & Tasks with Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiIcons.FiFolder} className="h-5 w-5 text-gray-400" />
              <button 
                onClick={handleViewAllProjects}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {filteredData.projects.slice(0, 5).map((project) => (
              <div 
                key={project.id} 
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => navigate('/projects')}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-white">{project.name}</h4>
                  <p className="text-sm text-gray-400">{project.location}</p>
                  <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'active' ? 'bg-green-500 text-white' :
                    project.status === 'completed' ? 'bg-blue-500 text-white' :
                    project.status === 'pending' ? 'bg-yellow-500 text-black' : 'bg-gray-500 text-white'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-sm text-gray-400">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Tasks</h3>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiIcons.FiCheckSquare} className="h-5 w-5 text-gray-400" />
              <button 
                onClick={handleViewAllTasks}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {filteredData.tasks.slice(0, 5).map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => navigate('/schedule')}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-white">{task.title}</h4>
                  <p className="text-sm text-gray-400">Due: {format(new Date(task.endDate), 'MMM dd, yyyy')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'active' ? 'bg-green-500 text-white' :
                    task.status === 'completed' ? 'bg-blue-500 text-white' :
                    task.status === 'pending' ? 'bg-yellow-500 text-black' : 'bg-gray-500 text-white'
                  }`}>
                    {task.status}
                  </span>
                  <span className="text-sm text-gray-400">{task.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={handleQuickProject}
            className="flex flex-col items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiIcons.FiPlus} className="h-6 w-6 text-blue-400 mb-2" />
            <span className="text-sm text-white">New Project</span>
          </button>
          <button 
            onClick={handleQuickDocument}
            className="flex flex-col items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiIcons.FiUpload} className="h-6 w-6 text-green-400 mb-2" />
            <span className="text-sm text-white">Upload Document</span>
          </button>
          <button 
            onClick={handleQuickReport}
            className="flex flex-col items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiIcons.FiFileText} className="h-6 w-6 text-purple-400 mb-2" />
            <span className="text-sm text-white">Generate Report</span>
          </button>
          <button 
            onClick={handleQuickTask}
            className="flex flex-col items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiIcons.FiCalendar} className="h-6 w-6 text-yellow-400 mb-2" />
            <span className="text-sm text-white">Schedule Task</span>
          </button>
        </div>
      </div>

      {/* Quick Project Modal */}
      {showQuickProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Quick New Project</h2>
              <button
                onClick={() => setShowQuickProjectModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleQuickProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={quickProjectForm.name}
                  onChange={(e) => setQuickProjectForm({ ...quickProjectForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  value={quickProjectForm.description}
                  onChange={(e) => setQuickProjectForm({ ...quickProjectForm, description: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={quickProjectForm.location}
                  onChange={(e) => setQuickProjectForm({ ...quickProjectForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Budget ($)</label>
                <input
                  type="number"
                  required
                  value={quickProjectForm.budget}
                  onChange={(e) => setQuickProjectForm({ ...quickProjectForm, budget: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={quickProjectForm.startDate}
                    onChange={(e) => setQuickProjectForm({ ...quickProjectForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={quickProjectForm.endDate}
                    onChange={(e) => setQuickProjectForm({ ...quickProjectForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuickProjectModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Task Modal */}
      {showQuickTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Quick New Task</h2>
              <button
                onClick={() => setShowQuickTaskModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleQuickTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={quickTaskForm.title}
                  onChange={(e) => setQuickTaskForm({ ...quickTaskForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  value={quickTaskForm.description}
                  onChange={(e) => setQuickTaskForm({ ...quickTaskForm, description: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
                <select
                  required
                  value={quickTaskForm.projectId}
                  onChange={(e) => setQuickTaskForm({ ...quickTaskForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Estimated Hours</label>
                <input
                  type="number"
                  required
                  value={quickTaskForm.estimatedHours}
                  onChange={(e) => setQuickTaskForm({ ...quickTaskForm, estimatedHours: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={quickTaskForm.startDate}
                    onChange={(e) => setQuickTaskForm({ ...quickTaskForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={quickTaskForm.endDate}
                    onChange={(e) => setQuickTaskForm({ ...quickTaskForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuickTaskModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Document Modal */}
      {showQuickDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Quick Document Upload</h2>
              <button
                onClick={() => setShowQuickDocumentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleQuickDocumentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Document Name</label>
                <input
                  type="text"
                  required
                  value={quickDocumentForm.name}
                  onChange={(e) => setQuickDocumentForm({ ...quickDocumentForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
                <select
                  required
                  value={quickDocumentForm.projectId}
                  onChange={(e) => setQuickDocumentForm({ ...quickDocumentForm, projectId: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                  <select
                    value={quickDocumentForm.type}
                    onChange={(e) => setQuickDocumentForm({ ...quickDocumentForm, type: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="document">Document</option>
                    <option value="blueprint">Blueprint</option>
                    <option value="specification">Specification</option>
                    <option value="report">Report</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={quickDocumentForm.category}
                    onChange={(e) => setQuickDocumentForm({ ...quickDocumentForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Design">Design</option>
                    <option value="Safety">Safety</option>
                    <option value="Materials">Materials</option>
                    <option value="Legal">Legal</option>
                    <option value="Environmental">Environmental</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Create Document
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuickDocumentModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Report Modal */}
      {showQuickReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Quick Report Generation</h2>
              <button
                onClick={() => setShowQuickReportModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleQuickReportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={quickReportForm.title}
                  onChange={(e) => setQuickReportForm({ ...quickReportForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Report Type</label>
                <select
                  value={quickReportForm.type}
                  onChange={(e) => setQuickReportForm({ ...quickReportForm, type: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="progress">Progress Report</option>
                  <option value="budget">Budget Analysis</option>
                  <option value="safety">Safety Report</option>
                  <option value="quality">Quality Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
                <select
                  required
                  value={quickReportForm.projectId}
                  onChange={(e) => setQuickReportForm({ ...quickReportForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Generate Report
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuickReportModal(false)}
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

export default Dashboard;