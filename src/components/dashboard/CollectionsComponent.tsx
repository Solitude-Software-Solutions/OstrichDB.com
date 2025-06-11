/**
 * =================================================
 * Author: Marshall Burns
 * GitHub: @SchoolyB
 * Contributors:
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * File Description:
 *    The component for managing a user's collections within a project.
 * =================================================
 **/

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { ArrowLeft, Database, Plus } from 'lucide-react';

interface Collection {
  name: string;
  description?: string;
  recordCount?: number;
  lastModified?: string;
}

interface CollectionData {
  name: string;
  description: string;
  encryption: boolean;
}

const CollectionsComponent: React.FC = () => {
  const navigate = useNavigate();
  const { projectName } = useParams<{ projectName: string }>();
  const { getToken, user, isAuthenticated } = useKindeAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [collectionData, setCollectionData] = useState<CollectionData>({
    name: '',
    description: '',
    encryption: true
  });

  useEffect(() => {
    if (isAuthenticated && user && projectName) {
      fetchCollections();
    }
  }, [isAuthenticated, user, projectName]);

  const fetchCollections = async () => {
    console.log('Project Name:', projectName); 
    console.log('Full URL:', `/api/v1/projects/${encodeURIComponent(projectName!)}/collections`);
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }


      const response = await fetch(`/api/v1/projects/${encodeURIComponent(projectName!)}/collections`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch collections: ${response.status}`);
      }

      const data = await response.text();

      try {
        const jsonData = JSON.parse(data);
        
        if (jsonData.collections && Array.isArray(jsonData.collections)) {
          const collectionsArray = jsonData.collections.map((name: string) => ({
            name,
            description: 'Database collection', // Placeholder
            recordCount: Math.floor(Math.random() * 1000), // Placeholder
            lastModified: 'Recently' // Placeholder
          }));
          setCollections(collectionsArray);
        } else {
          console.log('No collections array found in response');
          setCollections([]);
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Failed to parse response:', data);
        setCollections([]);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCollectionData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setCollectionData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!collectionData.name.trim()) {
      setError('Collection name is required');
      return;
    }

    try {
      setCreateLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

    
      const response = await fetch(`/api/v1/projects/${encodeURIComponent(projectName!)}/collections/${encodeURIComponent(collectionData.name)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          description: collectionData.description,
          encryption: collectionData.encryption
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create collection: ${errorText}`);
      }

      // Success - refresh the collections list and close modal
      await fetchCollections();
      setIsModalOpen(false);
      setCollectionData({ name: '', description: '', encryption: true });

    } catch (err) {
      console.error('Error creating collection:', err);
      setError(err instanceof Error ? err.message : 'Failed to create collection');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCollectionClick = (collectionName: string) => {
    console.log('Clicking collection:', collectionName);
    navigate(`/dashboard/projects/${encodeURIComponent(projectName!)}/collections/${encodeURIComponent(collectionName)}`);
  };

  const handleBackToProjects = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sb-amber"></div>
        <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
          Loading collections for {projectName}...
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
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={handleBackToProjects}
            className="flex items-center gap-2 text-sb-amber hover:text-sb-amber-dark transition-colors mr-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Projects</span>
          </button>
        </div>
        
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Collections in "{projectName}"
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {collections.length === 0
            ? "Get started by creating your first collection"
            : `You have ${collections.length} collection${collections.length === 1 ? '' : 's'}`
          }
        </p>
      </div>

      {/* Collections Grid */}
      {collections.length > 0 && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <div
              key={`collection-${index}-${collection.name}`}
              onClick={() => handleCollectionClick(collection.name)}
              className="border-2 border-gray-400 p-6 rounded-lg hover:bg-white hover:border-sb-amber hover:shadow-lg hover:-translate-y-1 hover:text-black transition-all duration-300 cursor-pointer transform"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Database size={24} className="text-sb-amber" />
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {collection.name || 'Unnamed Collection'}
                  </h3>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full" title="Active"></div>
              </div>
              
              {collection.description && (
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {collection.description}
                </p>
              )}
              
              <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <p>📊 Records: {collection.recordCount || 0}</p>
                <p>🕒 Last modified: {collection.lastModified || 'Unknown'}</p>
                <p>🔒 Encrypted: Yes</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Button */}
      <div className="w-full max-w-4xl">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full border-2 border-dashed border-gray-400 text-lg px-8 py-6 rounded-lg hover:bg-sb-amber hover:border-sb-amber hover:shadow-lg hover:-translate-y-1 hover:text-black transition-all duration-300 cursor-pointer transform flex items-center justify-center gap-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Plus size={24} />
          <span>Create New Collection</span>
        </button>
      </div>

      {/* Empty State */}
      {collections.length === 0 && !loading && !error && (
        <div className="w-full max-w-2xl text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No collections yet
          </h3>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            Create your first collection to start organizing your data in "{projectName}"
          </p>
        </div>
      )}

      {/* Create Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md border-2 border-gray-300 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Collection</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Collection Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={collectionData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-gray-300 rounded focus:border-sb-amber focus:outline-none text-gray-800"
                  placeholder="e.g., users, products, orders"
                  required
                  disabled={createLoading}
                  maxLength={50}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={collectionData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 border-gray-300 rounded focus:border-sb-amber focus:outline-none text-gray-800 h-20 resize-none"
                  placeholder="Describe what this collection will store..."
                  disabled={createLoading}
                  maxLength={200}
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="encryption"
                    checked={collectionData.encryption}
                    onChange={handleInputChange}
                    className="mr-2"
                    disabled={createLoading}
                  />
                  <span className="text-sm text-gray-700">
                    Enable AES-256 encryption (Recommended)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError(null);
                    setCollectionData({ name: '', description: '', encryption: true });
                  }}
                  className="px-4 py-2 border-2 border-gray-400 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:border-gray-500 transition-all duration-200"
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sb-amber hover:bg-sb-amber-dark text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={createLoading || !collectionData.name.trim()}
                >
                  {createLoading ? 'Creating...' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsComponent;
