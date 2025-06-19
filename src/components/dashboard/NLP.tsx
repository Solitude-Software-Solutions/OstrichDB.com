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
import { Send, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

const NLPInterface = () => {
  const [prompt, setPrompt] = useState('');
  const [nlpResponse, setNlpResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [finalResult, setFinalResult] = useState('');
  const [error, setError] = useState('');
  const { getToken, user, isAuthenticated } = useKindeAuth();

  // Mock project context - replace with actual project data
  const projectName = 'my-project'; // This should come from your routing or context
  

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setShowConfirmation(false);
    setFinalResult('');

    try {
      // Encode the prompt for URL
      const encodedPrompt = encodeURIComponent(prompt);
      
      // Call your NLP chat endpoint
      const response = await fetch(`http://localhost:8042/api/v1/projects/${projectName}/nlp/chat?value=${encodedPrompt}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Adjust based on your auth implementation
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
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Natural Language Data Management
        </h1>
        <p className="text-gray-600">
          Describe what you want to do with your data in plain English
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your command
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Create a new collection called 'user-data' or Delete all records in the 'temp' cluster"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading || showConfirmation}
              />
              <button
                onClick={handleSubmitPrompt}
                disabled={isLoading || !prompt.trim() || showConfirmation}
                className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MessageSquare className="w-4 h-4" />
            <span>Press Enter to send, or Shift+Enter for new line</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Confirmation Section */}
      {showConfirmation && nlpResponse && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-2 text-yellow-800 mb-4">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Confirm Action</span>
          </div>
          
          <div className="bg-white rounded-md p-4 mb-4 border">
            <h3 className="font-medium text-gray-900 mb-2">NLP Analysis:</h3>
            <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded text-sm font-mono">
              {nlpResponse}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConfirmAction}
              disabled={isConfirming}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Result */}
      {finalResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 text-green-800 mb-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Action Completed Successfully</span>
          </div>
          <div className="bg-white rounded-md p-4 border">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{finalResult}</pre>
          </div>
        </div>
      )}

      {/* Example Commands */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Example Commands:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            <span className="text-gray-700">"Create a new collection called 'user-profiles'"</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            <span className="text-gray-700">"Add a cluster named 'active-users' to the 'user-profiles' collection"</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            <span className="text-gray-700">"Create a record called 'john_doe' with value 'John Doe' and type 'STRING'"</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            <span className="text-gray-700">"Delete the 'temp-data' collection"</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            <span className="text-gray-700">"Show me all records in the 'users' cluster"</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NLPInterface;