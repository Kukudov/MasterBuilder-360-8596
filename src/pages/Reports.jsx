import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ReactECharts from 'echarts-for-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Reports = () => {
  const { user } = useAuth();
  const { projects, tasks, reports, addReport } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterProject, setFilterProject] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Filter data based on user role
  const getFilteredData = () => {
    switch (user.role) {
      case 'admin':
      case 'manager':
        return { projects, tasks, reports };
      case 'investor':
        const investorProjects = projects.filter(p => p.investors.includes(user.id));
        return {
          projects: investorProjects,
          tasks: tasks.filter(t => investorProjects.some(p => p.id === t.projectId)),
          reports: reports.filter(r => investorProjects.some(p => p.id === r.projectId))
        };
      default:
        return { projects: [], tasks: [], reports: [] };
    }
  };

  const filteredData = getFilteredData();

  // Filter reports for recent reports tab
  const getFilteredReports = () => {
    let filtered = filteredData.reports;
    
    if (filterProject !== 'all') {
      filtered = filtered.filter(r => r.projectId === filterProject);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const [formData, setFormData] = useState({
    title: '',
    type: 'progress',
    projectId: '',
    summary: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const project = projects.find(p => p.id === formData.projectId);
    const projectTasks = tasks.filter(t => t.projectId === formData.projectId);
    
    // Generate detailed report based on type
    let generatedDetails = {};
    let generatedSummary = '';
    
    switch (formData.type) {
      case 'progress':
        const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
        const totalTasks = projectTasks.length;
        const avgProgress = project ? project.progress : 0;
        
        generatedDetails = {
          tasksCompleted: completedTasks,
          tasksTotal: totalTasks,
          tasksInProgress: projectTasks.filter(t => t.status === 'active').length,
          tasksOverdue: projectTasks.filter(t => {
            const taskEnd = new Date(t.endDate);
            return taskEnd < new Date() && t.status !== 'completed';
          }).length,
          overallProgress: avgProgress,
          estimatedCompletion: project ? project.endDate : null
        };
        
        generatedSummary = `Progress Report: ${project?.name || 'Project'} is ${avgProgress}% complete with ${completedTasks}/${totalTasks} tasks finished. ${generatedDetails.tasksOverdue} tasks are overdue.`;
        break;
        
      case 'budget':
        const budgetUsed = project ? (project.spent / project.budget) * 100 : 0;
        generatedDetails = {
          budgetTotal: project?.budget || 0,
          budgetSpent: project?.spent || 0,
          budgetRemaining: project ? project.budget - project.spent : 0,
          percentageUsed: budgetUsed,
          projectedOverrun: budgetUsed > 100 ? project.spent - project.budget : 0,
          costPerTask: totalTasks > 0 ? (project?.spent || 0) / totalTasks : 0
        };
        
        generatedSummary = `Budget Analysis: ${budgetUsed.toFixed(1)}% of budget utilized. ${budgetUsed > 90 ? 'Caution: Approaching budget limit.' : 'Budget on track.'}`;
        break;
        
      case 'safety':
        const safetyScore = Math.floor(Math.random() * 20) + 80; // Simulate safety score
        const violations = Math.floor(Math.random() * 5);
        generatedDetails = {
          safetyScore: safetyScore,
          violations: violations,
          violationsResolved: Math.max(0, violations - 1),
          inspectionDate: new Date().toISOString(),
          recommendations: Math.floor(Math.random() * 8) + 2
        };
        
        generatedSummary = `Safety Report: Overall safety score of ${safetyScore}%. ${violations} violations found, ${generatedDetails.violationsResolved} resolved.`;
        break;
        
      case 'quality':
        const qualityScore = Math.floor(Math.random() * 25) + 75;
        const issues = Math.floor(Math.random() * 6);
        generatedDetails = {
          qualityScore: qualityScore,
          issuesFound: issues,
          issuesResolved: Math.floor(issues * 0.8),
          recommendedActions: Math.floor(Math.random() * 6) + 3,
          complianceLevel: qualityScore > 85 ? 'High' : qualityScore > 70 ? 'Medium' : 'Low'
        };
        
        generatedSummary = `Quality Assessment: ${qualityScore}% quality score with ${issues} issues identified. Compliance level: ${generatedDetails.complianceLevel}.`;
        break;
        
      default:
        generatedDetails = {
          generatedAt: new Date().toISOString(),
          dataPoints: Math.floor(Math.random() * 100) + 50,
          accuracy: Math.floor(Math.random() * 20) + 80
        };
        generatedSummary = formData.summary || `${formData.type} report generated for ${project?.name || 'project'}.`;
    }

    addReport({
      ...formData,
      summary: generatedSummary,
      createdBy: user.id,
      status: 'completed',
      details: generatedDetails
    });
    
    toast.success('Report generated successfully');
    setShowModal(false);
    setFormData({
      title: '',
      type: 'progress',
      projectId: '',
      summary: ''
    });
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getReportIcon = (type) => {
    switch (type) {
      case 'progress': return FiIcons.FiTrendingUp;
      case 'budget': return FiIcons.FiDollarSign;
      case 'safety': return FiIcons.FiShield;
      case 'quality': return FiIcons.FiCheckCircle;
      case 'environmental': return FiIcons.FiLeaf;
      case 'completion': return FiIcons.FiFlag;
      case 'traffic': return FiIcons.FiNavigation;
      case 'feasibility': return FiIcons.FiTarget;
      default: return FiIcons.FiFileText;
    }
  };

  const getReportColor = (type) => {
    switch (type) {
      case 'progress': return 'bg-blue-500';
      case 'budget': return 'bg-green-500';
      case 'safety': return 'bg-red-500';
      case 'quality': return 'bg-purple-500';
      case 'environmental': return 'bg-teal-500';
      case 'completion': return 'bg-indigo-500';
      case 'traffic': return 'bg-orange-500';
      case 'feasibility': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const viewReportDetails = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  // Chart data
  const projectProgressData = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1f2937',
      borderColor: '#374151',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['Progress %'],
      textStyle: { color: '#fff' }
    },
    xAxis: {
      type: 'category',
      data: filteredData.projects.map(p => p.name.substring(0, 15) + '...'),
      axisLabel: { color: '#fff' }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: { color: '#fff' }
    },
    series: [{
      name: 'Progress %',
      type: 'bar',
      data: filteredData.projects.map(p => p.progress),
      itemStyle: { color: '#3b82f6' }
    }]
  };

  const budgetAnalysisData = {
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
      name: 'Budget Distribution',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      data: filteredData.projects.map(p => ({
        value: p.budget / 1000000,
        name: p.name
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0,0,0,0.5)'
        }
      }
    }]
  };

  const taskStatusData = {
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
      name: 'Task Status',
      type: 'pie',
      radius: '50%',
      data: [
        { value: filteredData.tasks.filter(t => t.status === 'active').length, name: 'Active' },
        { value: filteredData.tasks.filter(t => t.status === 'completed').length, name: 'Completed' },
        { value: filteredData.tasks.filter(t => t.status === 'pending').length, name: 'Pending' }
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

  const canManageReports = user.role === 'admin' || user.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
        {canManageReports && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiIcons.FiPlus} className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {['overview', 'projects', 'tasks', 'budget', 'recent'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab === 'recent' ? 'Recent Reports' : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Projects</p>
                  <p className="text-2xl font-bold text-white">{filteredData.projects.length}</p>
                </div>
                <div className="bg-blue-500 rounded-full p-3">
                  <SafeIcon icon={FiIcons.FiFolder} className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Tasks</p>
                  <p className="text-2xl font-bold text-white">
                    {filteredData.tasks.filter(t => t.status === 'active').length}
                  </p>
                </div>
                <div className="bg-green-500 rounded-full p-3">
                  <SafeIcon icon={FiIcons.FiCheckSquare} className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Budget</p>
                  <p className="text-2xl font-bold text-white">
                    ${(filteredData.projects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="bg-yellow-500 rounded-full p-3">
                  <SafeIcon icon={FiIcons.FiDollarSign} className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Reports Generated</p>
                  <p className="text-2xl font-bold text-white">{filteredData.reports.length}</p>
                </div>
                <div className="bg-purple-500 rounded-full p-3">
                  <SafeIcon icon={FiIcons.FiFileText} className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Project Progress</h3>
              <ReactECharts option={projectProgressData} style={{ height: '300px' }} />
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Task Status Distribution</h3>
              <ReactECharts option={taskStatusData} style={{ height: '300px' }} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Project Performance</h3>
            <ReactECharts option={projectProgressData} style={{ height: '400px' }} />
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Project Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Progress</th>
                    <th className="px-6 py-3">Budget</th>
                    <th className="px-6 py-3">Spent</th>
                    <th className="px-6 py-3">End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.projects.map((project) => (
                    <tr key={project.id} className="bg-gray-800 border-b border-gray-700">
                      <td className="px-6 py-4 font-medium text-white">{project.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'active' ? 'bg-green-500 text-white' :
                          project.status === 'completed' ? 'bg-blue-500 text-white' :
                          project.status === 'pending' ? 'bg-yellow-500 text-black' : 'bg-gray-500 text-white'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{project.progress}%</td>
                      <td className="px-6 py-4">${(project.budget / 1000000).toFixed(1)}M</td>
                      <td className="px-6 py-4">${(project.spent / 1000000).toFixed(1)}M</td>
                      <td className="px-6 py-4">{format(new Date(project.endDate), 'MMM dd, yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Task Status Overview</h3>
            <ReactECharts option={taskStatusData} style={{ height: '400px' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-4">Active Tasks</h4>
              <div className="space-y-2">
                {filteredData.tasks.filter(t => t.status === 'active').slice(0, 5).map((task) => (
                  <div key={task.id} className="p-3 bg-gray-700 rounded">
                    <p className="text-sm font-medium text-white">{task.title}</p>
                    <p className="text-xs text-gray-400">{getProjectName(task.projectId)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-4">Completed Tasks</h4>
              <div className="space-y-2">
                {filteredData.tasks.filter(t => t.status === 'completed').slice(0, 5).map((task) => (
                  <div key={task.id} className="p-3 bg-gray-700 rounded">
                    <p className="text-sm font-medium text-white">{task.title}</p>
                    <p className="text-xs text-gray-400">{getProjectName(task.projectId)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-4">Pending Tasks</h4>
              <div className="space-y-2">
                {filteredData.tasks.filter(t => t.status === 'pending').slice(0, 5).map((task) => (
                  <div key={task.id} className="p-3 bg-gray-700 rounded">
                    <p className="text-sm font-medium text-white">{task.title}</p>
                    <p className="text-xs text-gray-400">{getProjectName(task.projectId)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Budget Distribution</h3>
            <ReactECharts option={budgetAnalysisData} style={{ height: '400px' }} />
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Budget Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Project</th>
                    <th className="px-6 py-3">Total Budget</th>
                    <th className="px-6 py-3">Amount Spent</th>
                    <th className="px-6 py-3">Remaining</th>
                    <th className="px-6 py-3">% Used</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.projects.map((project) => {
                    const percentUsed = (project.spent / project.budget) * 100;
                    const remaining = project.budget - project.spent;
                    return (
                      <tr key={project.id} className="bg-gray-800 border-b border-gray-700">
                        <td className="px-6 py-4 font-medium text-white">{project.name}</td>
                        <td className="px-6 py-4">${(project.budget / 1000000).toFixed(1)}M</td>
                        <td className="px-6 py-4">${(project.spent / 1000000).toFixed(1)}M</td>
                        <td className="px-6 py-4">${(remaining / 1000000).toFixed(1)}M</td>
                        <td className="px-6 py-4">{percentUsed.toFixed(1)}%</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            percentUsed < 70 ? 'bg-green-500 text-white' :
                            percentUsed < 90 ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'
                          }`}>
                            {percentUsed < 70 ? 'On Track' : percentUsed < 90 ? 'Caution' : 'Over Budget'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
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
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="progress">Progress</option>
              <option value="budget">Budget</option>
              <option value="safety">Safety</option>
              <option value="quality">Quality</option>
              <option value="environmental">Environmental</option>
              <option value="completion">Completion</option>
            </select>
          </div>

          {/* Recent Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredReports().map((report) => (
              <div key={report.id} className="bg-gray-800 rounded-lg p-6 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${getReportColor(report.type)}`}>
                    <SafeIcon icon={getReportIcon(report.type)} className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-400 capitalize">{report.type}</span>
                </div>
                <h4 className="font-medium text-white mb-2">{report.title}</h4>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{report.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span>{getProjectName(report.projectId)}</span>
                  <span>{format(new Date(report.createdAt), 'MMM dd')}</span>
                </div>
                <button
                  onClick={() => viewReportDetails(report)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <SafeIcon icon={FiIcons.FiEye} className="h-4 w-4" />
                  <span>View Details</span>
                </button>
              </div>
            ))}
          </div>

          {getFilteredReports().length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiIcons.FiFileText} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No reports found</h3>
              <p className="text-gray-400">
                {filterProject !== 'all' || filterType !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Generate your first report to get started'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Generate Report Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Generate Report</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Report Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="progress">Progress Report</option>
                  <option value="budget">Budget Analysis</option>
                  <option value="safety">Safety Report</option>
                  <option value="quality">Quality Report</option>
                  <option value="environmental">Environmental Report</option>
                  <option value="completion">Completion Report</option>
                </select>
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Custom Summary (Optional)
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows="3"
                  placeholder="Leave empty for auto-generated summary"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Details Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{selectedReport.title}</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Report Type</p>
                  <p className="text-white capitalize">{selectedReport.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Project</p>
                  <p className="text-white">{getProjectName(selectedReport.projectId)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Generated</p>
                  <p className="text-white">{format(new Date(selectedReport.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-green-400 capitalize">{selectedReport.status}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Summary</p>
                <p className="text-white">{selectedReport.summary}</p>
              </div>
              
              {selectedReport.details && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Report Details</p>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(selectedReport.details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;