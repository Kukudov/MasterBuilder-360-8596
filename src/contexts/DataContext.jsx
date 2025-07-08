import React, { createContext, useContext, useState, useEffect } from 'react';
import { projects } from '../data/projects';
import { tasks } from '../data/tasks';
import { documents } from '../data/documents';
import { reports } from '../data/reports';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [projectsData, setProjectsData] = useState(projects);
  const [tasksData, setTasksData] = useState(tasks);
  const [documentsData, setDocumentsData] = useState(documents);
  const [reportsData, setReportsData] = useState(reports);

  // Project CRUD operations
  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjectsData(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (id, updates) => {
    setProjectsData(prev => 
      prev.map(project => 
        project.id === id 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
    );
  };

  const deleteProject = (id) => {
    setProjectsData(prev => prev.filter(project => project.id !== id));
    setTasksData(prev => prev.filter(task => task.projectId !== id));
  };

  // Task CRUD operations
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasksData(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasksData(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasksData(prev => prev.filter(task => task.id !== id));
  };

  // Document CRUD operations
  const addDocument = (document) => {
    const newDocument = {
      ...document,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString()
    };
    setDocumentsData(prev => [...prev, newDocument]);
    return newDocument;
  };

  const deleteDocument = (id) => {
    setDocumentsData(prev => prev.filter(doc => doc.id !== id));
  };

  // Report CRUD operations
  const addReport = (report) => {
    const newReport = {
      ...report,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setReportsData(prev => [...prev, newReport]);
    return newReport;
  };

  const value = {
    projects: projectsData,
    tasks: tasksData,
    documents: documentsData,
    reports: reportsData,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addDocument,
    deleteDocument,
    addReport
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};