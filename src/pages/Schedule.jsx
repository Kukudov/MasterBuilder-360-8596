import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const Schedule = () => {
  const { user } = useAuth();
  const { projects, tasks, addTask, updateTask, deleteTask } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Filter tasks based on user role
  const getFilteredTasks = () => {
    switch (user.role) {
      case 'admin':
      case 'manager':
        return tasks;
      case 'worker':
        return tasks.filter(t => t.assignedTo === user.id);
      default:
        return [];
    }
  };

  const filteredTasks = getFilteredTasks();

  // Get week days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    priority: 'medium',
    category: 'Construction',
    estimatedHours: '',
    startDate: '',
    endDate: ''
  });

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return filteredTasks.filter(task => {
      const taskStart = parseISO(task.startDate);
      const taskEnd = parseISO(task.endDate);
      return date >= taskStart && date <= taskEnd;
    });
  };

  // Navigate weeks
  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle day click to add task
  const handleDayClick = (date) => {
    if (user.role === 'admin' || user.role === 'manager') {
      setSelectedDate(date);
      setTaskForm({
        ...taskForm,
        startDate: format(date, 'yyyy-MM-dd'),
        endDate: format(date, 'yyyy-MM-dd')
      });
      setShowTaskModal(true);
    }
  };

  // Handle task form submission
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    
    if (editingTask) {
      updateTask(editingTask.id, {
        ...taskForm,
        estimatedHours: parseInt(taskForm.estimatedHours),
        progress: editingTask.progress,
        actualHours: editingTask.actualHours
      });
      toast.success('Task updated successfully');
    } else {
      addTask({
        ...taskForm,
        estimatedHours: parseInt(taskForm.estimatedHours),
        status: 'pending',
        progress: 0,
        actualHours: 0
      });
      toast.success('Task created successfully');
    }

    // Reset form
    setTaskForm({
      title: '',
      description: '',
      projectId: '',
      assignedTo: '',
      priority: 'medium',
      category: 'Construction',
      estimatedHours: '',
      startDate: '',
      endDate: ''
    });
    setShowTaskModal(false);
    setEditingTask(null);
    setSelectedDate(null);
  };

  // Handle task edit
  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      assignedTo: task.assignedTo,
      priority: task.priority,
      category: task.category,
      estimatedHours: task.estimatedHours.toString(),
      startDate: task.startDate,
      endDate: task.endDate
    });
    setShowTaskModal(true);
  };

  // Handle task delete
  const handleTaskDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      toast.success('Task deleted successfully');
    }
  };

  // Handle task status update
  const handleTaskStatusUpdate = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    let progress = task.progress;
    
    if (newStatus === 'completed') {
      progress = 100;
    } else if (newStatus === 'active' && progress === 0) {
      progress = 10;
    }
    
    updateTask(taskId, { status: newStatus, progress });
    toast.success(`Task marked as ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getUserName = (userId) => {
    // In real app, this would fetch from users data
    return `User ${userId.slice(-3)}`;
  };

  const upcomingTasks = filteredTasks
    .filter(task => {
      const taskStart = parseISO(task.startDate);
      const today = new Date();
      return taskStart > today;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5);

  const overdueTasks = filteredTasks
    .filter(task => {
      const taskEnd = parseISO(task.endDate);
      const today = new Date();
      return taskEnd < today && task.status !== 'completed';
    })
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  const canManageTasks = user.role === 'admin' || user.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Schedule</h1>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {canManageTasks && (
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              <SafeIcon icon={FiIcons.FiPlus} className="h-4 w-4" />
              <span>New Task</span>
            </button>
          )}
          <button
            onClick={goToPreviousWeek}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            <SafeIcon icon={FiIcons.FiChevronLeft} className="h-4 w-4" />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            <SafeIcon icon={FiIcons.FiChevronRight} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-4">
          {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
        </h2>

        {/* Week Calendar */}
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayTasks = getTasksForDate(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toString()}
                className={`bg-gray-700 rounded-lg p-3 min-h-[200px] cursor-pointer hover:bg-gray-600 transition-colors ${
                  isToday ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    {format(day, 'EEE')}
                  </span>
                  <span className={`text-lg font-bold ${isToday ? 'text-blue-400' : 'text-white'}`}>
                    {format(day, 'd')}
                  </span>
                </div>

                <div className="space-y-1">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-2 rounded text-xs bg-gray-600 border-l-4 ${getPriorityColor(task.priority)} group relative`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}></div>
                        <span className="text-white font-medium truncate">{task.title}</span>
                      </div>
                      <p className="text-gray-400 truncate">{getProjectName(task.projectId)}</p>

                      {canManageTasks && (
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleTaskEdit(task)}
                              className="p-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                              title="Edit Task"
                            >
                              <SafeIcon icon={FiIcons.FiEdit} className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleTaskDelete(task.id)}
                              className="p-1 bg-red-600 hover:bg-red-700 rounded text-white"
                              title="Delete Task"
                            >
                              <SafeIcon icon={FiIcons.FiTrash} className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Task Status Quick Actions */}
                      <div className="mt-1 flex space-x-1">
                        {task.status === 'pending' && (
                          <button
                            onClick={() => handleTaskStatusUpdate(task.id, 'active')}
                            className="px-1 py-0.5 bg-green-600 hover:bg-green-700 rounded text-xs text-white"
                          >
                            Start
                          </button>
                        )}
                        {task.status === 'active' && (
                          <button
                            onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                            className="px-1 py-0.5 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {canManageTasks && dayTasks.length === 0 && (
                    <div className="text-center py-2">
                      <span className="text-xs text-gray-500">Click to add task</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Tasks</h3>
            <SafeIcon icon={FiIcons.FiClock} className="h-5 w-5 text-blue-400" />
          </div>
          <div className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div key={task.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{task.title}</h4>
                      <p className="text-sm text-gray-400">{getProjectName(task.projectId)}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)} text-white`}>
                          {task.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          Starts: {format(parseISO(task.startDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority).replace('border-l-', 'bg-')}`}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No upcoming tasks</p>
            )}
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Overdue Tasks</h3>
            <SafeIcon icon={FiIcons.FiAlertTriangle} className="h-5 w-5 text-red-400" />
          </div>
          <div className="space-y-3">
            {overdueTasks.length > 0 ? (
              overdueTasks.map((task) => (
                <div key={task.id} className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{task.title}</h4>
                      <p className="text-sm text-gray-400">{getProjectName(task.projectId)}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)} text-white`}>
                          {task.status}
                        </span>
                        <span className="text-xs text-red-400">
                          Due: {format(parseISO(task.endDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {canManageTasks && (
                        <>
                          <button
                            onClick={() => handleTaskEdit(task)}
                            className="p-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                            title="Edit Task"
                          >
                            <SafeIcon icon={FiIcons.FiEdit} className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleTaskDelete(task.id)}
                            className="p-1 bg-red-600 hover:bg-red-700 rounded text-white"
                            title="Delete Task"
                          >
                            <SafeIcon icon={FiIcons.FiTrash} className="h-3 w-3" />
                          </button>
                        </>
                      )}
                      <SafeIcon icon={FiIcons.FiAlertTriangle} className="h-5 w-5 text-red-400" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No overdue tasks</p>
            )}
          </div>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Task Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{filteredTasks.length}</div>
            <div className="text-sm text-gray-400">Total Tasks</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {filteredTasks.filter(t => t.status === 'active').length}
            </div>
            <div className="text-sm text-gray-400">Active Tasks</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {filteredTasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{overdueTasks.length}</div>
            <div className="text-sm text-gray-400">Overdue</div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingTask ? 'Edit Task' : selectedDate ? `New Task for ${format(selectedDate, 'MMM dd, yyyy')}` : 'New Task'}
              </h2>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTask(null);
                  setSelectedDate(null);
                  setTaskForm({
                    title: '',
                    description: '',
                    projectId: '',
                    assignedTo: '',
                    priority: 'medium',
                    category: 'Construction',
                    estimatedHours: '',
                    startDate: '',
                    endDate: ''
                  });
                }}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project
                </label>
                <select
                  required
                  value={taskForm.projectId}
                  onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
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
                  Assign To
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  placeholder="Worker ID (e.g., wrk-001)"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Construction">Construction</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Site Work">Site Work</option>
                    <option value="Finishing">Finishing</option>
                    <option value="Safety">Safety</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Planning">Planning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={taskForm.estimatedHours}
                  onChange={(e) => setTaskForm({ ...taskForm, estimatedHours: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={taskForm.startDate}
                    onChange={(e) => setTaskForm({ ...taskForm, startDate: e.target.value })}
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
                    value={taskForm.endDate}
                    onChange={(e) => setTaskForm({ ...taskForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingTask(null);
                    setSelectedDate(null);
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

export default Schedule;