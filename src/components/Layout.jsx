import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: FiIcons.FiHome,
      roles: ['admin', 'manager', 'investor', 'worker']
    },
    { 
      name: 'Projects', 
      path: '/projects', 
      icon: FiIcons.FiFolder,
      roles: ['admin', 'manager', 'investor', 'worker']
    },
    { 
      name: 'Schedule', 
      path: '/schedule', 
      icon: FiIcons.FiCalendar,
      roles: ['admin', 'manager', 'worker']
    },
    { 
      name: 'Documents', 
      path: '/documents', 
      icon: FiIcons.FiFile,
      roles: ['admin', 'manager', 'investor']
    },
    { 
      name: 'Reports', 
      path: '/reports', 
      icon: FiIcons.FiBarChart,
      roles: ['admin', 'manager', 'investor']
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: FiIcons.FiSettings,
      roles: ['admin', 'manager', 'investor', 'worker']
    },
    { 
      name: 'Admin', 
      path: '/admin', 
      icon: FiIcons.FiShield,
      roles: ['admin']
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-800 transition-all duration-300 flex-shrink-0`}>
        <div className="flex items-center justify-between p-4">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
            <h1 className="text-xl font-bold text-white">MasterBuilder 360</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SafeIcon icon={FiIcons.FiMenu} className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                location.pathname === item.path ? 'bg-gray-700 text-white border-r-4 border-blue-500' : ''
              }`}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5" />
              <span className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-white capitalize">
                {location.pathname.slice(1) || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <SafeIcon icon={FiIcons.FiLogOut} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;