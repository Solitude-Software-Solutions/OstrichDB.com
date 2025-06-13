/**
 * =================================================
 * Author: Marshall A Burns
 * GitHub: @SchoolyB
 * Contributors:
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * File Description:
 *    Collection overview dashboard component for the dashboard.
 *    Displays collection statistics, clusters, recent activity,
 *    and health indicators.
 * =================================================
 **/

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { 
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  Database,
  FileText,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Lock,
  Zap,
  Activity,
  X,
  Lightbulb,
  Target,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface CollectionStats {
  totalClusters: number;
  totalRecords: number;
  storageUsed: string;
  lastUpdated: string;
}

interface Cluster {
  name: string;
  id: string;
  recordCount: number;
  size: string;
  lastModified: string;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  type: 'cluster_created' | 'record_updated' | 'query_executed' | 'data_exported';
  message: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface HealthIndicator {
  label: string;
  status: 'healthy' | 'warning' | 'error';
  icon: React.ReactNode;
  message: string;
}

const CollectionOverview: React.FC = () => {
  const { projectName, collectionName } = useParams<{
    projectName: string;
    collectionName: string;
  }>();
  
  const navigate = useNavigate();
  const { getToken, user, isAuthenticated } = useKindeAuth();

  // Component state
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [healthIndicators, setHealthIndicators] = useState<HealthIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showClusters, setShowClusters] = useState(false);

  // Navigation functions
  const navigateToProjects = () => {
    navigate(`/dashboard/projects/${encodeURIComponent(projectName!)}/collections`);
  };

  const navigateToCollections = () => {
    navigate(`/dashboard/projects/${encodeURIComponent(projectName!)}/collections`);
  };

  const handleRefresh = () => {
    fetchCollectionOverview();
  };

  useEffect(() => {
    if (isAuthenticated && user && projectName && collectionName) {
      fetchCollectionOverview();
    }
  }, [isAuthenticated, user, projectName, collectionName]);

  const fetchCollectionOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data - replace with actual API calls
      const mockStats: CollectionStats = {
        totalClusters: 5,
        totalRecords: 1247,
        storageUsed: '2.4 MB',
        lastUpdated: '2 hours ago'
      };

      const mockClusters: Cluster[] = [
        {
          name: 'users',
          id: 'cluster_001',
          recordCount: 1247,
          size: '1.8 MB',
          lastModified: '2 hours ago',
          createdAt: '2025-01-10T09:30:00'
        },
        {
          name: 'products',
          id: 'cluster_002', 
          recordCount: 856,
          size: '542 KB',
          lastModified: '1 day ago',
          createdAt: '2025-01-12T14:15:00'
        },
        {
          name: 'orders',
          id: 'cluster_003',
          recordCount: 2341,
          size: '3.2 MB', 
          lastModified: '3 hours ago',
          createdAt: '2025-01-11T11:45:00'
        }
      ];
      const mockActivity: ActivityItem[] = [
        {
          id: '1',
          type: 'cluster_created',
          message: "New cluster 'users' created",
          timestamp: '3 hours ago',
          icon: <Database size={16} className="text-blue-400" />
        },
        {
          id: '2',
          type: 'record_updated',
          message: "Record 'john_doe' updated in 'customers'",
          timestamp: '5 hours ago',
          icon: <FileText size={16} className="text-green-400" />
        },
        {
          id: '3',
          type: 'query_executed',
          message: "Query executed: 'Show me all active users'",
          timestamp: '1 day ago',
          icon: <Zap size={16} className="text-yellow-400" />
        },
        {
          id: '4',
          type: 'data_exported',
          message: "Data exported to CSV format",
          timestamp: '2 days ago',
          icon: <TrendingUp size={16} className="text-purple-400" />
        }
      ];

      const mockHealth: HealthIndicator[] = [
        {
          label: 'Cluster Health',
          status: 'healthy',
          icon: <CheckCircle size={16} className="text-green-400" />,
          message: 'All clusters are healthy and accessible'
        },
        {
          label: 'Encryption',
          status: 'healthy',
          icon: <Lock size={16} className="text-green-400" />,
          message: 'AES-256 encryption enabled'
        },
        {
          label: 'Data Validation',
          status: 'healthy',
          icon: <Shield size={16} className="text-green-400" />,
          message: 'All records pass validation checks'
        },
        {
          label: 'Performance',
          status: 'healthy',
          icon: <Activity size={16} className="text-green-400" />,
          message: 'Query response times are optimal'
        }
      ];

      setStats(mockStats);
      setClusters(mockClusters);
      setRecentActivity(mockActivity);
      setHealthIndicators(mockHealth);

    } catch (err) {
      console.error('Error fetching collection overview:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch collection data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: HealthIndicator['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleClusterClick = (clusterName: string) => {
    navigate(`/dashboard/projects/${encodeURIComponent(projectName!)}/collections/${encodeURIComponent(collectionName!)}/cluster-editor/${encodeURIComponent(clusterName)}`);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sb-amber"></div>
        <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
          Loading collection overview...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={navigateToCollections}
                className="flex items-center gap-2 text-sb-amber hover:text-sb-amber-dark transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Collections
              </button>
              <div className="h-6 w-px" style={{ backgroundColor: 'var(--border-color)' }}></div>
              
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={navigateToProjects}
                  className="text-sb-amber hover:text-sb-amber-dark transition-colors"
                >
                  {projectName}
                </button>
                <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{collectionName}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHelpModal(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-400 rounded-lg hover:border-sb-amber transition-colors"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              >
                <HelpCircle size={16} />
                Help & Tips
              </button>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 rounded-lg border-2 border-gray-400 hover:border-sb-amber transition-colors"
                style={{ backgroundColor: 'var(--bg-primary)' }}
                title="Refresh"
              >
                <RefreshCw size={16} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-red-400 font-medium">Error</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</div>
              </div>
              <button onClick={() => setError(null)} className="ml-auto">
                <X size={16} className="text-red-400 hover:text-red-300" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Collection Statistics */}
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Collection Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                className="p-6 rounded-lg border"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database size={20} className="text-blue-400" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Total Clusters
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats?.totalClusters || 0}
                </div>
              </div>

              <div 
                className="p-6 rounded-lg border"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-green-400" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Total Records
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatNumber(stats?.totalRecords || 0)}
                </div>
              </div>

              <div 
                className="p-6 rounded-lg border"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={20} className="text-purple-400" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Storage Used
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats?.storageUsed || '0 KB'}
                </div>
              </div>

              <div 
                className="p-6 rounded-lg border"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock size={20} className="text-yellow-400" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Last Updated
                    </span>
                  </div>
                </div>
                <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats?.lastUpdated || 'Never'}
                </div>
              </div>
            </div>
          </div>

          {/* Clusters Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Clusters
              </h2>
              <button
                onClick={() => setShowClusters(!showClusters)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-400 rounded-lg hover:border-sb-amber transition-colors"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                {showClusters ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showClusters ? 'Hide' : 'Show'} Clusters</span>
                {showClusters ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>

            {showClusters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clusters.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      No clusters yet
                    </h3>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Create your first cluster to organize your data
                    </p>
                    <button
                      onClick={() => navigate(`/dashboard/projects/${encodeURIComponent(projectName!)}/collections/${encodeURIComponent(collectionName!)}/cluster-editor`)}
                      className="bg-sb-amber hover:bg-sb-amber-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Create First Cluster
                    </button>
                  </div>
                ) : (
                  clusters.map((cluster) => (
                    <div
                      key={cluster.id}
                      onClick={() => handleClusterClick(cluster.name)}
                      className="p-4 rounded-lg border-2 border-gray-400 hover:bg-white hover:border-sb-amber hover:shadow-lg hover:-translate-y-1 hover:text-black transition-all duration-300 cursor-pointer transform"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Database size={20} className="text-sb-amber flex-shrink-0" />
                          <h3 
                            className="font-semibold truncate" 
                            style={{ color: 'var(--text-primary)' }}
                            title={cluster.name}
                          >
                            {cluster.name}
                          </h3>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" title="Active"></div>
                      </div>
                      
                      <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <p>📝 Records: {formatNumber(cluster.recordCount)}</p>
                        <p>📊 Size: {cluster.size}</p>
                        <p>🕒 Modified: {cluster.lastModified}</p>
                        <p className="text-xs">ID: {cluster.id}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Recent Activity
              </h2>
              <div 
                className="rounded-lg border"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                {recentActivity.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      No Recent Activity
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Activity will appear here as you work with your collection
                    </p>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="p-4 flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {activity.message}
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Collection Health */}
            <div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Collection Health
              </h2>
              <div 
                className="rounded-lg border p-6"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="space-y-4">
                  {healthIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {indicator.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {indicator.label}
                          </span>
                          <span className={`text-xs font-medium ${getStatusColor(indicator.status)}`}>
                            {indicator.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {indicator.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-lg border"
            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
          >
            <div className="sticky top-0 bg-inherit border-b px-6 py-4" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Collection Help & Tips
                </h2>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={20} className="text-yellow-400" />
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Getting Started Tips
                  </h3>
                </div>
                <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sb-amber rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Create your first cluster:</strong> Think of clusters as folders that group related data together. For example, create a "users" cluster for all user information.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sb-amber rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Use the Cluster Editor:</strong> Perfect for building and organizing your data structure visually, just like a spreadsheet.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sb-amber rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Try Natural Language Queries:</strong> Ask questions like "Show me all users created this month" or "Find records where status is active".</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sb-amber rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Export your data anytime:</strong> Download your collection data in CSV, JSON, or Excel format with one click.</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target size={20} className="text-green-400" />
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Best Practices
                  </h3>
                </div>
                <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Keep clusters focused:</strong> Group related data together, but don't make clusters too large. Consider splitting if you have 50+ different record types.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Regular backups:</strong> Export your important data regularly, especially before major changes.</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={20} className="text-blue-400" />
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Common Use Cases
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div 
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  >
                    <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Customer Management</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>Create clusters for customers, orders, and support tickets. Link them together with shared IDs.</p>
                  </div>
                  <div 
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  >
                    <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Content Management</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>Store blog posts, pages, and media. Use DATE fields for publish dates and BOOLEAN for published status.</p>
                  </div>
                  <div 
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  >
                    <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Inventory Tracking</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>Track products, quantities, and suppliers. Use INTEGER for stock counts and FLOAT for prices.</p>
                  </div>
                  <div 
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  >
                    <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Event Management</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>Organize events, attendees, and schedules. Use DATETIME for precise timing and []STRING for attendee lists.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Users size={20} className="text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Need More Help?</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Check out our documentation or join our community for support. We're here to help you succeed with OstrichDB!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionOverview;