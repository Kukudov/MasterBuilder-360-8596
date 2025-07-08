import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [avatarMethod, setAvatarMethod] = useState('url');
  const [tempAvatarUrl, setTempAvatarUrl] = useState(user?.avatar || '');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    darkMode: true,
    language: 'en',
    timezone: 'UTC'
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30
  });

  // All world timezones
  const timezones = [
    { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
    { value: 'GMT', label: 'GMT - Greenwich Mean Time' },
    { value: 'EST', label: 'EST - Eastern Standard Time (UTC-5)' },
    { value: 'CST', label: 'CST - Central Standard Time (UTC-6)' },
    { value: 'MST', label: 'MST - Mountain Standard Time (UTC-7)' },
    { value: 'PST', label: 'PST - Pacific Standard Time (UTC-8)' },
    { value: 'AKST', label: 'AKST - Alaska Standard Time (UTC-9)' },
    { value: 'HST', label: 'HST - Hawaii Standard Time (UTC-10)' },
    { value: 'ADT', label: 'ADT - Atlantic Daylight Time (UTC-3)' },
    { value: 'BRT', label: 'BRT - Brasilia Time (UTC-3)' },
    { value: 'ART', label: 'ART - Argentina Time (UTC-3)' },
    { value: 'CET', label: 'CET - Central European Time (UTC+1)' },
    { value: 'EET', label: 'EET - Eastern European Time (UTC+2)' },
    { value: 'MSK', label: 'MSK - Moscow Standard Time (UTC+3)' },
    { value: 'GST', label: 'GST - Gulf Standard Time (UTC+4)' },
    { value: 'IST', label: 'IST - India Standard Time (UTC+5:30)' },
    { value: 'BST', label: 'BST - Bangladesh Standard Time (UTC+6)' },
    { value: 'ICT', label: 'ICT - Indochina Time (UTC+7)' },
    { value: 'CST_CHINA', label: 'CST - China Standard Time (UTC+8)' },
    { value: 'JST', label: 'JST - Japan Standard Time (UTC+9)' },
    { value: 'AEST', label: 'AEST - Australian Eastern Standard Time (UTC+10)' },
    { value: 'NZST', label: 'NZST - New Zealand Standard Time (UTC+12)' },
    { value: 'CAT', label: 'CAT - Central Africa Time (UTC+2)' },
    { value: 'WAT', label: 'WAT - West Africa Time (UTC+1)' },
    { value: 'EAT', label: 'EAT - East Africa Time (UTC+3)' },
    { value: 'SAST', label: 'SAST - South Africa Standard Time (UTC+2)' },
    { value: 'WIB', label: 'WIB - Western Indonesian Time (UTC+7)' },
    { value: 'WIT', label: 'WIT - Eastern Indonesian Time (UTC+9)' },
    { value: 'KST', label: 'KST - Korea Standard Time (UTC+9)' },
    { value: 'PHT', label: 'PHT - Philippine Time (UTC+8)' },
    { value: 'SGT', label: 'SGT - Singapore Time (UTC+8)' },
    { value: 'MYT', label: 'MYT - Malaysia Time (UTC+8)' },
    { value: 'HKT', label: 'HKT - Hong Kong Time (UTC+8)' },
    { value: 'TWN', label: 'TWN - Taiwan Time (UTC+8)' }
  ];

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Simulate profile update
    toast.success('Profile updated successfully');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    // Simulate password update
    toast.success('Password updated successfully');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast.success('Preferences updated');
  };

  const handleSecurityChange = (key, value) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
    toast.success('Security settings updated');
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
        setTempAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      toast.success('Photo uploaded successfully');
    }
  };

  const handleAvatarUrlSubmit = () => {
    if (!tempAvatarUrl) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    // Test if the URL is valid by creating an image element
    const img = new Image();
    img.onload = () => {
      setAvatarUrl(tempAvatarUrl);
      setAvatarFile(null);
      toast.success('Avatar URL updated successfully');
    };
    img.onerror = () => {
      toast.error('Invalid image URL. Please check the URL and try again.');
    };
    img.src = tempAvatarUrl;
  };

  const handleAvatarMethodChange = (method) => {
    setAvatarMethod(method);
    if (method === 'url') {
      setTempAvatarUrl(avatarUrl);
    }
  };

  const resetAvatarChanges = () => {
    setAvatarUrl(user?.avatar || '');
    setTempAvatarUrl(user?.avatar || '');
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Avatar changes reset');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: FiIcons.FiUser },
    { id: 'preferences', name: 'Preferences', icon: FiIcons.FiSettings },
    { id: 'security', name: 'Security', icon: FiIcons.FiShield },
    { id: 'notifications', name: 'Notifications', icon: FiIcons.FiBell }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
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
      <div className="bg-gray-800 rounded-lg p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={avatarUrl || user?.avatar}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
                  }}
                />
                {avatarFile && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <SafeIcon icon={FiIcons.FiCheck} className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
                <p className="text-gray-400 capitalize">{user?.role}</p>
                
                {/* Avatar Change Options */}
                <div className="mt-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAvatarMethodChange('url')}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        avatarMethod === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      onClick={() => handleAvatarMethodChange('upload')}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        avatarMethod === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      Upload
                    </button>
                    <button
                      onClick={resetAvatarChanges}
                      className="px-3 py-1 text-xs rounded bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                  
                  {avatarMethod === 'url' ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="url"
                          placeholder="Enter image URL (e.g., https://example.com/photo.jpg)"
                          value={tempAvatarUrl}
                          onChange={(e) => setTempAvatarUrl(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleAvatarUrlSubmit}
                          disabled={!tempAvatarUrl || tempAvatarUrl === avatarUrl}
                          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
                        >
                          Update
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Paste a direct link to an image file (JPG, PNG, GIF, WebP)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        className="hidden"
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center space-x-2"
                        >
                          <SafeIcon icon={FiIcons.FiUpload} className="h-4 w-4" />
                          <span>Choose Photo</span>
                        </button>
                        {avatarFile && (
                          <span className="text-sm text-green-400 flex items-center space-x-1">
                            <SafeIcon icon={FiIcons.FiCheck} className="h-4 w-4" />
                            <span>{avatarFile.name}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Upload an image file (JPG, PNG, GIF, WebP) - Max 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={user?.role}
                  disabled
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    toast.info('Form reset to original values');
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>

            <hr className="border-gray-700" />

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.newPassword && formData.newPassword.length < 8 && (
                    <p className="text-red-400 text-sm mt-1">Password must be at least 8 characters</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      !formData.currentPassword || 
                      !formData.newPassword || 
                      !formData.confirmPassword || 
                      formData.newPassword !== formData.confirmPassword ||
                      formData.newPassword.length < 8
                    }
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Application Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Dark Mode</h4>
                  <p className="text-sm text-gray-400">Use dark theme across the application</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('darkMode', !preferences.darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.darkMode ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Language</h4>
                  <p className="text-sm text-gray-400">Choose your preferred language</p>
                </div>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Timezone</h4>
                  <p className="text-sm text-gray-400">Select your timezone</p>
                </div>
                <select
                  value={preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => handleSecurityChange('twoFactorAuth', !security.twoFactorAuth)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Login Alerts</h4>
                  <p className="text-sm text-gray-400">Get notified of new login attempts</p>
                </div>
                <button
                  onClick={() => handleSecurityChange('loginAlerts', !security.loginAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    security.loginAlerts ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Session Timeout</h4>
                  <p className="text-sm text-gray-400">Automatically log out after inactivity</p>
                </div>
                <select
                  value={security.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={240}>4 hours</option>
                  <option value={480}>8 hours</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-white font-medium mb-4">Active Sessions</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiIcons.FiMonitor} className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Current Session</p>
                      <p className="text-sm text-gray-400">Chrome on Windows • Active now</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-400 bg-green-900 px-2 py-1 rounded">Current</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiIcons.FiSmartphone} className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">Mobile Session</p>
                      <p className="text-sm text-gray-400">iPhone Safari • 2 hours ago</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toast.success('Session terminated')}
                    className="text-xs text-red-400 hover:text-red-300 underline transition-colors"
                  >
                    Terminate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-400">Receive project updates via email</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-400">Get instant notifications in your browser</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('pushNotifications', !preferences.pushNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.pushNotifications ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Weekly Reports</h4>
                  <p className="text-sm text-gray-400">Receive weekly project summary reports</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('weeklyReports', !preferences.weeklyReports)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.weeklyReports ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-white font-medium mb-4">Notification Types</h4>
              <div className="space-y-3">
                {[
                  { name: 'Task Assignments', description: 'When you are assigned new tasks', enabled: true },
                  { name: 'Project Updates', description: 'Changes to project status or timeline', enabled: true },
                  { name: 'Budget Alerts', description: 'When projects exceed budget thresholds', enabled: false },
                  { name: 'Deadline Reminders', description: 'Upcoming task and project deadlines', enabled: true },
                  { name: 'Team Messages', description: 'Messages from team members', enabled: true }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <button 
                      onClick={() => toast.success(`${item.name} ${item.enabled ? 'disabled' : 'enabled'}`)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        item.enabled ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} 
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;