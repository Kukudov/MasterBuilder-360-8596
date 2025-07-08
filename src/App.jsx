import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import AuthGuard from './components/AuthGuard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Schedule from './pages/Schedule';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen bg-gray-900 text-white">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <AuthGuard>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="/dashboard" element={
                  <AuthGuard>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="/projects" element={
                  <AuthGuard>
                    <Layout>
                      <Projects />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="/schedule" element={
                  <AuthGuard>
                    <Layout>
                      <Schedule />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="/documents" element={
                  <AuthGuard>
                    <Layout>
                      <Documents />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="/reports" element={
                  <AuthGuard>
                    <Layout>
                      <Reports />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="/settings" element={
                  <AuthGuard>
                    <Layout>
                      <Settings />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="/admin" element={
                  <AuthGuard requiredRole="admin">
                    <Layout>
                      <Admin />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                    border: '1px solid #374151',
                  },
                }}
              />
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </DndProvider>
  );
}

export default App;