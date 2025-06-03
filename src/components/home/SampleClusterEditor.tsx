/**
 * =================================================
 * #Author: Marshall A Burns
 * GitHub: @SchoolyB
 * #Contributors:
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * #File Description:
 *    Interactive cluster editor demo component for the homepage.
 * =================================================
 **/

import React, { useState } from "react";

const ClusterEditor: React.FC = () => {
  const [clusterName, setClusterName] = useState("");
  const [records, setRecords] = useState<Array<{
    id: number;
    name: string;
    type: string;
    value: string;
  }>>([]);
  const [showResult, setShowResult] = useState(false);
  const [showError, setShowError] = useState(false);

  const dataTypes = ["STRING", "CHAR", "INTEGER", "FLOAT", "BOOLEAN", "[]STRING"];

  const addRecord = () => {
    if (records.length >= 4) {
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
      return;
    }
    
    const newRecord = {
      id: Date.now(),
      name: "",
      type: "STRING",
      value: ""
    };
    setRecords(prev => [...prev, newRecord]);
  };

  const updateRecord = (id: number, field: string, value: string) => {
    setRecords(prev => 
      prev.map(record => 
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  const removeRecord = (id: number) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  const createCluster = () => {
    if (clusterName && records.length > 0) {
      setShowResult(true);
      setTimeout(() => setShowResult(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-100 mb-2">Build Your First Cluster</h3>
        <p className="text-gray-400 text-sm">Create a cluster and add up to 4 records to see how it works</p>
      </div>
      
      {/* Cluster Info */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Cluster Name</label>
            <input
              type="text"
              placeholder="e.g., users, products, orders"
              value={clusterName}
              onChange={(e) => setClusterName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200 placeholder-gray-500"
              maxLength={24}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Cluster ID</label>
            <input
              type="text"
              value="12345"
              disabled
              className="w-full bg-gray-600 border border-gray-600 rounded px-3 py-2 text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Records Section */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium text-gray-300">Records ({records.length}/4)</h4>
          <button
            onClick={addRecord}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              records.length >= 4 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
            disabled={records.length >= 4}
          >
            + Add Record
          </button>
        </div>

        {/* Records List */}
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
              <div className="grid grid-cols-12 gap-2 items-center">
                {/* Record Name */}
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="record_name"
                    value={record.name}
                    onChange={(e) => updateRecord(record.id, 'name', e.target.value)}
                    className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-gray-200 placeholder-gray-400 text-sm"
                    maxLength={24}
                  />
                </div>
                
                {/* Colon */}
                <div className="col-span-1 text-center text-gray-400">:</div>
                
                {/* Record Type */}
                <div className="col-span-3">
                  <select
                    value={record.type}
                    onChange={(e) => updateRecord(record.id, 'type', e.target.value)}
                    className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-gray-200 text-sm"
                  >
                    {dataTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Colon */}
                <div className="col-span-1 text-center text-gray-400">:</div>
                
                {/* Record Value */}
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="value"
                    value={record.value}
                    onChange={(e) => updateRecord(record.id, 'value', e.target.value)}
                    className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-gray-200 placeholder-gray-400 text-sm"
                    maxLength={64}
                  />
                </div>
                
                {/* Remove Button */}
                <div className="col-span-1">
                  <button
                    onClick={() => removeRecord(record.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 text-xs transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {records.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No records yet. Click "Add Record" to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {showError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 animate-pulse">
          <div className="text-red-400 text-sm font-medium mb-1">🎮 Whoa there, eager beaver!</div>
          <div className="text-xs text-gray-400">
            This is just a demo - you can only add 4 records here. Sign in to create unlimited records and unleash the full power! 🚀
          </div>
        </div>
      )}

      {/* Create Cluster Button */}
      <button
        onClick={createCluster}
        disabled={!clusterName || records.length === 0}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          clusterName && records.length > 0
            ? 'bg-amber-600 hover:bg-amber-700 text-white'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        Create Cluster
      </button>

      {/* Result display */}
      {showResult && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 animate-pulse">
          <div className="text-green-400 text-sm font-medium mb-2">🎉 Awesome! Your cluster would be created!</div>
          <div className="bg-gray-800/50 rounded p-3 font-mono text-xs">
            <div className="text-amber-400 mb-2">cluster_name :identifier: {clusterName}</div>
            <div className="text-amber-400 mb-2">cluster_id :identifier: 12345</div>
            <div className="text-gray-300">
              {records.map(record => (
                <div key={record.id} className="mb-1">
                  {record.name} :{record.type}: {record.value || '""'}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClusterEditor;