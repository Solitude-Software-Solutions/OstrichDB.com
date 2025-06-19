/**
 * =================================================
 * Author: Marshall A Burns
 * GitHub: @SchoolyB
 *           
 * Contributors:
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * File Description:
 *    This file contains the NLP interface component
 * =================================================
 **/
 
import React, { useState } from 'react';
import { Send, MessageSquare, CheckCircle, AlertTriangle, Loader2, X, Lightbulb, ArrowLeft, HelpCircle } from 'lucide-react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useParams, useNavigate } from 'react-router-dom';

const NLPInterface = () => {
  const { projectName } = useParams<{ projectName: string }>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [nlpResponse, setNlpResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [finalResult, setFinalResult] = useState('');
  const [error, setError] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const { getToken, user, isAuthenticated } = useKindeAuth();

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setShowConfirmation(false);
    setFinalResult('');

    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Encode the prompt for URL
      const encodedPrompt = encodeURIComponent(prompt);
      
      // Call your NLP chat endpoint
      const response = await fetch(`http://localhost:8042/api/v1/projects/${projectName}/nlp/chat?value=${encodedPrompt}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      setNlpResponse(responseText);
      setShowConfirmation(true);
    } catch (err) {
      setError(`Failed to process request: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!nlpResponse) return;

    setIsConfirming(true);
    setError('');

    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Send the NLP response to the finalize endpoint
      const response = await fetch(`http://localhost:8042/api/v1/projects/${projectName}/nlp/finalize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: nlpResponse
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      setFinalResult(result);
      setShowConfirmation(false);
      setPrompt('');
      setNlpResponse('');
    } catch (err) {
      setError(`Failed to execute action: ${err.message}`);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setNlpResponse('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitPrompt();
    }
  };

  const navigateToProject = () => {
    navigate(`/dashboard/projects/${encodeURIComponent(projectName!)}/collections`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={navigateToProject}
                className="flex items-center gap-2 text-sb-amber hover:text-sb-amber-dark transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Project
              </button>
              <div className="h-6 w-px" style={{ backgroundColor: 'var(--border-color)' }}></div>
              
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-sb-amber">{projectName}</span>
                <span style={{ color: 'var(--text-secondary)' }}>/</span>
                <span style={{ color: 'var(--text-primary)' }}>Natural Language Interface</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHelpModal(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-400 rounded-lg hover:border-sb-amber transition-colors"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              >
                <HelpCircle size={16} />
                Help & Examples
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
              <button onClick={() => setError('')} className="ml-auto">
                <X size={16} className="text-red-400 hover:text-red-300" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Natural Language Data Management
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Describe what you want to do with your data in plain English
            </p>
          </div>

          {/* Input Section */}
          <div 
            className="rounded-lg border p-6"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Enter your command
                </label>
                <div className="relative">
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Create a new collection called 'user-data' or Delete all records in the 'temp' cluster"
                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:border-sb-amber focus:outline-none resize-none transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                    rows={3}
                    disabled={isLoading || showConfirmation}
                  />
                  <button
                    onClick={handleSubmitPrompt}
                    disabled={isLoading || !prompt.trim() || showConfirmation}
                    className="absolute bottom-3 right-3 p-2 bg-sb-amber hover:bg-sb-amber-dark text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <MessageSquare className="w-4 h-4" />
                <span>Press Enter to send, or Shift+Enter for new line</span>
              </div>
            </div>
          </div>

          {/* Confirmation Section */}
          {showConfirmation && nlpResponse && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-center gap-2 text-yellow-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Confirm Action</span>
              </div>
              
              <div 
                className="rounded-md p-4 mb-4 border"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
              >
                <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>NLP Analysis:</h3>
                <div 
                  className="p-3 rounded text-sm font-mono border"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <pre className="whitespace-pre-wrap">{nlpResponse}</pre>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmAction}
                  disabled={isConfirming}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isConfirming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {isConfirming ? 'Executing...' : 'Confirm & Execute'}
                </button>
                
                <button
                  onClick={handleCancel}
                  disabled={isConfirming}
                  className="px-4 py-2 border-2 border-gray-400 rounded-lg hover:border-sb-amber transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Success Result */}
          {finalResult && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center gap-2 text-green-400 mb-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Action Completed Successfully</span>
              </div>
              <div 
                className="rounded-md p-4 border"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
              >
                <pre className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{finalResult}</pre>
              </div>
            </div>
          )}
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
                  Natural Language Interface Help
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
                    How It Works
                  </h3>
                </div>
                <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sb-amber rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Type your command:</strong> Describe what you want to do with your data in natural language.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sb-amber rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Review the analysis:</strong> The system will interpret your command and show you what it will do.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sb-amber rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Confirm or cancel:</strong> You can review the action before it's executed on your data.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Example Commands
                </h3>
                <div className="space-y-3">
                  <div 
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  >
                    <h4 className="font-medium mb-2 text-green-400">Collection Management</h4>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"Create a new collection called 'user-profiles'"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"Delete the 'temp-data' collection"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"Show me all collections in this project"</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  >
                    <h4 className="font-medium mb-2 text-blue-400">Cluster Operations</h4>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"Add a cluster named 'active-users' to the 'user-profiles' collection"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"Remove the 'inactive-users' cluster"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"List all clusters in the 'analytics' collection"</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  >
                    <h4 className="font-medium mb-2 text-purple-400">Record Management</h4>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"Create a record called 'john_doe' with value 'John Doe' and type 'STRING'"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"Update the 'user_count' record to value 150"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"Show me all records in the 'users' cluster"</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  >
                    <h4 className="font-medium mb-2 text-orange-400">Data Queries</h4>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"Find all users where status is 'active'"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"Show me records created this month"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span>"Count how many records are in the 'products' cluster"</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare size={20} className="text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Tips for Better Results</h4>
                    <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <p>• Be specific about collection and cluster names</p>
                      <p>• Include data types when creating records (STRING, INTEGER, BOOLEAN, etc.)</p>
                      <p>• Use quotes around names that contain spaces</p>
                      <p>• Always review the analysis before confirming actions</p>
                    </div>
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

export default NLPInterface;