// /**
//  * =================================================
//  * Author: Feda Elvis
//  * GitHub: @FedaElvis
//  *           
//  * Contributors:
//  *           @SchoolyB
//  *
//  * License: Apache License 2.0 (see LICENSE file for details)
//  * Copyright (c) 2025-Present Archetype Dynamics, Inc.
//  * File Description:
//  *    The component for managing a users projects in the dashboard.
//  * =================================================
//  **/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

interface Project {
  name: string;
}
interface ProjectData {
  name: string;
  collaborators: string; // Not yet implemented in the backend, just a placeholder for now
  password: string; // Not yet implemented in the backend, just a placeholder for now
}


const ProjectsComponent: React.FC = () => {
  const navigate = useNavigate();
  const { getToken, user, isAuthenticated } = useKindeAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    collaborators: '',
    password: ''
  });
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjects();
    }
  }, [isAuthenticated, user]);
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      //Get a lists of all the projects available to the logged in user

      //TODO: This endpoint is temporary and will be replaced with the actual projects endpoint when available
      const response = await fetch('http://localhost:8042/api/v1/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      // const response = await fetch('/api/v1/projects', {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      //   },
      // });

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const data = await response.text();

  
      //The projects endpoint returns a JSON object of arrays so need to parse them
      //to properly each project on the frontend
      try {
        const jsonData = JSON.parse(data);
       
        if (jsonData.projects && Array.isArray(jsonData.projects)) {
          const projectsArray = jsonData.projects.map((name: string) => {
 
            return { name };
          });
          setProjects(projectsArray);
        } else {
          console.log('No projects array found in response');
          setProjects([]);
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Failed to parse response:', data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setCreateLoading(true);
      setError(null);
  
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Create the project by making a POST request to the backend. 
      // TODO: This endpoint is temporary and will be replaced with the actual projects endpoint when available
      const response = await fetch(`http://localhost:8042/api/v1/projects/${encodeURIComponent(projectData.name)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create project: ${errorText}`);
      }

      // Success - refresh the projects list and close modal
      await fetchProjects();
      setIsModalOpen(false);
      setProjectData({ name: '', collaborators: '', password: '' });
  
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setCreateLoading(false);
    }
  };
    const handleProjectClick = (projectName: string) => {
    navigate(`/dashboard/projects/${encodeURIComponent(projectName)}/collections`);
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sb-amber"></div>
        <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
          Loading { user?.givenName}'s' projects...
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-6 mt-40">
      {error && (
        <div className="w-full max-w-2xl bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
          <div className="text-red-400 text-sm font-medium mb-1">Error</div>
          <div className="text-xs text-red-300 whitespace-pre-wrap">{error}</div>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {user?.givenName}'s Projects
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {projects.length === 0
            ? "Get started by creating your first project"
            : `You have ${projects.length} project${projects.length === 1 ? '' : 's'}`
          }
        </p>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={`project-${index}-${project.name}`}
              onClick={() => handleProjectClick(project.name)}
              className="border-2 border-gray-400 p-6 rounded-lg hover:bg-white hover:border-sb-amber hover:shadow-lg hover:-translate-y-1 hover:text-black transition-all duration-300 cursor-pointer transform"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {project.name || 'Unnamed Project'} {/* Fallback for empty names */}
                </h3>
                <div className="w-3 h-3 bg-green-500 rounded-full" title="Active"></div>
              </div>          
              <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <p>📁 Collections: Loading...</p>
                <p>🕒 Last modified: Recently</p>
              </div>
            </div>
          ))}
        </div>
      )}
          {/* Create Project Button */}
          <div className="w-full max-w-4xl">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full border-2 border-dashed border-gray-400 text-lg px-8 py-6 rounded-lg hover:bg-sb-amber hover:border-sb-amber hover:shadow-lg hover:-translate-y-1 hover:text-black transition-all duration-300 cursor-pointer transform"
          style={{ color: 'var(--text-secondary)' }}
        >
          + Create New Project
        </button>
      </div>

      {/* In the event that there are not projects available to the user, display a placeholder message to encourage them to create their first project. This goes goes away after making a proj */}
      {projects.length === 0 && !loading && !error && (
        <div className="w-full max-w-2xl text-center py-12">
          <div className="text-6xl mb-4">🗂️</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No projects yet
          </h3>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            Create your first project to start building with OstrichDB
          </p>
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md border-2 border-gray-300 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Project</h2>
        
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
        
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={projectData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-gray-300 rounded focus:border-sb-amber focus:outline-none text-gray-800"
                  placeholder="Enter project name"
                  required
                  disabled={createLoading}
                />
              </div>
          
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Add Collaborator (Email)
                </label>
                <input
                  type="email"
                  name="collaborators"
                  value={projectData.collaborators}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-gray-300 rounded focus:border-sb-amber focus:outline-none text-gray-800"
                  placeholder="colleague@example.com (optional)"
                  disabled={createLoading}
                />
              </div>
          
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Project Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={projectData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-gray-300 rounded focus:border-sb-amber focus:outline-none text-gray-800"
                  placeholder="Enter password for project (optional)"
                  disabled={createLoading}
                />
              </div>
          
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError(null);
                    setProjectData({ name: '', collaborators: '', password: '' });
                  }}
                  className="px-4 py-2 border-2 border-gray-400 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:border-gray-500 transition-all duration-200"
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sb-amber hover:bg-sb-amber-dark text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={createLoading || !projectData.name.trim()}
                >
                  {createLoading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsComponent;