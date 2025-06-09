/**
 * =================================================
 * #Author: Feda Elvis
 * GitHub: @FedaElvis
 *           
 * #Contributors:
 *           @SchoolyB
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * #File Description:
 *    The component for managing a users projects in the dashboard.
 * =================================================
 **/

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectsComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    collaborators: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle project creation logic here
    console.log('Project created:', projectData);
    setIsModalOpen(false);
  };

  const handleStartFree = () => {
    navigate('/databaseSelection');
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-40">
      {/* Top Row (Create project & Example project) */}
      <div className="flex justify-center gap-6 w-full">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center border-2 border-gray-400 text-sm px-12 py-1 rounded-lg hover:bg-white hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 hover:text-black transition-all duration-300 cursor-pointer transform"
        >
          Create project
        </button>
        
        <div className="border-2 border-gray-400 text-sm px-6 py-1 rounded-lg hover:bg-white hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 hover:text-black transition-all duration-300 cursor-pointer transform">
          <p>Example project</p>
          <p>Name: My cool project</p>
          <p>collections: 1</p>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="w-1/2 border-2 border-gray-400 text-sm px-10 py-6 rounded-lg hover:bg-white hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 hover:text-black transition-all duration-300 cursor-pointer transform text-center">
        Will be displayed if user doesn't have a any projects created yet.
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md border-2 border-gray-300 shadow-xl">
            {/* <h2 className="text-xl font-bold mb-4">Create New Project</h2> */}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1"></label>
                <input
                  type="text"
                  name="name"
                  value={projectData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  placeholder='Enter name of project'
                  required
                />
              </div>
              
              <div className="mb-4">
                {/* <label className="block text-sm font-medium mb-1">Add Collaborator (Email)</label> */}
                <input
                  type="email"
                  name="collaborators"
                  value={projectData.collaborators}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  placeholder='Add collaborator?'
                />
              </div>
              
              <div className="mb-6">
                {/* <label className="block text-sm font-medium mb-1">Project Password</label> */}
                <input
                  type="password"
                  name="password"
                  value={projectData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  placeholder='Enter password for project'
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border-2 border-gray-400 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:border-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: 'var(--bg-primary)' }}
                  onClick={handleStartFree} 
                  className="items-center border-2 border-gray-400 text-sm px-12 py-1 rounded-lg hover:bg-white hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 hover:text-black transition-all duration-300 cursor-pointer transform"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsComponent