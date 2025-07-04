/**
 * =================================================
 * Author: Marshall A Burns
 * GitHub: @SchoolyB
 * Contributors:
 *          @galessalazar
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * File Description:
 *    Cluster editor component for managing data records
 * =================================================
 **/

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  ArrowLeft,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronRight,
} from "lucide-react";
import {
  RecordDataType,
  getDataTypesByCategory,
  validateRecordName,
  validateRecordValue,
  getDefaultValue,
  getInputPropsForType,
  DATA_TYPE_DESCRIPTIONS,
  DATA_TYPE_EXAMPLES,
} from "../../utils/recordDataTypes";

interface Record {
  id: string;
  serverId?: string; //This would come from the server if available: 1,2,3,4,etc.
  name: string;
  originalName?: string; // Track original name for renaming
  type: RecordDataType;
  originalType?: RecordDataType; // Track original type
  value: string;
  originalValue?: string; // Track original value
  isNew?: boolean;
  isModified?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  modifiedFields?: Set<string>; // Track specific fields that changed
}

interface ClusterInfo {
  name: string;
  id: string;
  recordCount: number;
  size: string;
  createdAt: string;
  lastModified: string;
  encryption: boolean;
}

type SortDirection = "asc" | "desc";
type SortField = "name" | "type" | "value";
type SaveStatus = "saved" | "saving" | "error" | "unsaved";

const ClusterEditor: React.FC = () => {
  const { projectName, collectionName, clusterName } = useParams<{
    projectName: string;
    collectionName: string;
    clusterName?: string;
  }>();

  const navigate = useNavigate();
  const { getToken, user, isAuthenticated } = useKindeAuth();

  // Component state
  const [records, setRecords] = useState<Record[]>([]);
  const [clusterInfo, setClusterInfo] = useState<ClusterInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cluster search/create state
  const [availableClusters, setAvailableClusters] = useState<ClusterInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newClusterName, setNewClusterName] = useState("");

  // UI state
  const [filterType, setFilterType] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(
    new Set()
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showRawModal, setShowRawModal] = useState(false);

  // Get categorized data types for the UI
  const dataTypeCategories = getDataTypesByCategory();

  // Determine if we're in search mode or editing a specific cluster
  const isSearchMode = !clusterName;
  const isEditMode = !!clusterName;

  const isNewCluster =
    isEditMode && availableClusters.every((c) => c.name !== clusterName);

  // Generate raw format function
  const generateRawFormat = () => {
    if (!clusterInfo || !records.length) return "";

    let rawContent = "{\n";

    // Add cluster metadata
    rawContent += `\tcluster_name :identifier: ${clusterInfo.name}\n`;
    rawContent += `\tcluster_id :identifier: ${clusterInfo.id}\n\n`;

    // Add each record
    records.forEach((record, index) => {
      if (record.name && record.value) {
        rawContent += `\t${record.name} :${record.type}: ${record.value}`;
        if (index < records.length - 1) {
          rawContent += "\n";
        }
      }
    });

    rawContent += "\n},";

    return rawContent;
  };

  // Auto-save functionality with debouncing
  const autoSave = useCallback(async () => {
    if (!isEditMode || saveStatus === "saving") return;

    // Validate all records first
    const invalidRecords = records.filter((record) => {
      const validation = validateRecord(record);
      return !validation.isValid;
    });

    if (invalidRecords.length > 0) {
      setSaveStatus("error");
      return;
    }

    try {
      setSaveStatus("saving");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mark all records as saved
      setRecords((prev) =>
        prev.map((record) => ({
          ...record,
          isNew: false,
          isModified: false,
        }))
      );

      setSaveStatus("saved");
    } catch (err) {
      console.error("Auto-save failed:", err);
      setSaveStatus("error");
    }
  }, [records, isEditMode, saveStatus]);

  // Debounced auto-save effect
  useEffect(() => {
    const hasChanges = records.some((r) => r.isNew || r.isModified);
    if (!hasChanges) {
      setSaveStatus("saved");
      return;
    }

    setSaveStatus("unsaved");
    const timeoutId = setTimeout(autoSave, 1500);
    return () => clearTimeout(timeoutId);
  }, [records, autoSave]);

  useEffect(() => {
    if (isAuthenticated && user && projectName && collectionName) {
      if (isSearchMode) {
        fetchAvailableClusters();
      } else if (!isNewCluster) {
        // If editing an existing cluster
        fetchRecordsInCluster();
      } else {
        setRecords([]);
        setClusterInfo({
          name: clusterName!,
          id: "unsaved",
          recordCount: 0,
          size: "0 records",
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          encryption: false,
        });
        setLoading(false);
      }
    }
  }, [
    isAuthenticated,
    user,
    projectName,
    collectionName,
    clusterName,
    isSearchMode,
    isNewCluster,
  ]);

  const fetchAvailableClusters = async () => {
    try {
      const token = await getToken();
      setLoading(true);
      setError(null);
  
      const clusters = await fetch(
        `http://localhost:8042/api/v1/projects/${encodeURIComponent(
          projectName!
        )}/collections/${encodeURIComponent(collectionName!)}/clusters`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
  
      const clustersText = await clusters.text();
      let clustersData;
      
      try {
        clustersData = JSON.parse(clustersText);
      } catch {
        clustersData = clustersText;
      }
  
      if (!clusters.ok) {
        throw new Error(
          (typeof clustersData === 'object' && clustersData?.message) || 
          clustersData || 
          "Failed to fetch clusters"
        );
      }
  
      setAvailableClusters(
        Array.isArray(clustersData?.clusters) ? clustersData.clusters : []
      );
    } catch (err) {
      console.error("Error fetching available clusters:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch clusters");
      setAvailableClusters([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecordsInCluster = async () => {
    try {
      const token = await getToken();
      setLoading(true);
      setError(null);
      // First, fetch the cluster metadata from the clusters list

      const clustersResponse = await fetch(
        `http://localhost:8042/api/v1/projects/${encodeURIComponent(
          projectName!
        )}/collections/${encodeURIComponent(collectionName!)}/clusters`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      let clusterMetadata = null;
      if (clustersResponse.ok) {
        const clustersData = await clustersResponse.json();
        if (clustersData.clusters && Array.isArray(clustersData.clusters)) {
          // Find the specific cluster we're editing
          const targetCluster = clustersData.clusters.find(
            (cluster: any) => cluster.name === clusterName
          );

          if (targetCluster) {
            clusterMetadata = {
              name: targetCluster.name,
              id: targetCluster.id.toString(), // This is the actual cluster ID
              recordCount: targetCluster.record_count,
              size: "Unknown", // You can update this if the API provides size
              lastModified: "Unknown", // You can update this if the API provides lastModified
              createdAt: "Unknown", // You can update this if the API provides createdAt
              encryption: true, // Default or from API if available
            };
          }
        }
      }

      // Then fetch all the records for the selected cluster
      const response = await fetch(
        `http://localhost:8042/api/v1/projects/${encodeURIComponent(
          projectName!
        )}/collections/${encodeURIComponent(
          collectionName!
        )}/clusters/${encodeURIComponent(clusterName!)}/records`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const recordsText = await response.text();
      let recordsData;
      
      try {
        recordsData = JSON.parse(recordsText);
      } catch {
        recordsData = recordsText;
      }

      if (!response.ok) {
        throw new Error((typeof recordsData === 'object' && recordsData?.message) || recordsData || "Failed to fetch records");
      }

      let recordsArray = [];

      if (Array.isArray(recordsData)) {
        recordsArray = recordsData;
      } else if (recordsData && Array.isArray(recordsData.records)) {
        recordsArray = recordsData.records;
      } else if (recordsData && typeof recordsData === "object") {
        recordsArray = [];
      }

      const transformedRecords = recordsArray.map(
        (
          record: { id: any; name: any; type: any; value: any },
          index: number
        ) => ({
          id: `client_${Date.now()}_${index}_${Math.random()
            .toString(36)
            .substr(2, 9)}`, // Always unique client ID
          serverId: record.id, // Keep server ID for reference if needed
          name: record.name || "",
          originalName: record.name || "",
          type: record.type || "STRING",
          originalType: record.type || "STRING",
          value: record.value || "",
          originalValue: record.value || "",
          isNew: false,
          isModified: false,
          hasError: false,
          modifiedFields: new Set<string>(),
        })
      );
      setRecords(transformedRecords);

      // Set cluster info using the fetched metadata
      if (clusterMetadata) {
        // Update record count with actual count from records
        clusterMetadata.recordCount = transformedRecords.length;
        setClusterInfo(clusterMetadata);
      } else {
        // Fallback if cluster metadata wasn't found
        setClusterInfo({
          name: clusterName!,
          id: "unknown", // This will only happen if the cluster wasn't found in the list
          recordCount: transformedRecords.length,
          size: `${transformedRecords.length} records`,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          encryption: false,
        });
      }
    } catch (err) {
      console.error("Error fetching cluster data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch cluster data"
      );
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };
  const handleClusterSelect = (selectedClusterName: string) => {
    navigate(
      `/dashboard/projects/${encodeURIComponent(
        projectName!
      )}/collections/${encodeURIComponent(
        collectionName!
      )}/cluster-editor/${encodeURIComponent(selectedClusterName)}`
    );
  };

  // Handle creating new cluster
  const handleCreateNewCluster = () => {
    if (!newClusterName.trim()) {
      setError("Cluster name is required");
      return;
    }

    // Validate cluster name
    const nameValidation = validateRecordName(newClusterName);
    if (!nameValidation.isValid) {
      setError(nameValidation.errorMessage || "Invalid cluster name");
      return;
    }

    // Check for duplicates
    if (
      availableClusters.some(
        (cluster) => cluster.name.toLowerCase() === newClusterName.toLowerCase()
      )
    ) {
      setError("A cluster with this name already exists");
      return;
    }

    // Navigate to new cluster
    navigate(
      `/dashboard/projects/${encodeURIComponent(
        projectName!
      )}/collections/${encodeURIComponent(
        collectionName!
      )}/cluster-editor/${encodeURIComponent(newClusterName)}`
    );
  };

  // Navigation functions
  const navigateToProjects = () => {
    navigate(
      `/dashboard/projects/${encodeURIComponent(projectName!)}/collections`
    );
  };

  const navigateToCollection = () => {
    navigate(
      `/dashboard/projects/${encodeURIComponent(
        projectName!
      )}/collections/${encodeURIComponent(collectionName!)}`
    );
  };

  const handleRefresh = () => {
    if (isSearchMode) {
      fetchAvailableClusters();
    } else {
      fetchRecordsInCluster();
    }
  };

  // Filter clusters based on search term
  // const filteredClusters = availableClusters.filter(cluster =>
  //   cluster.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredClusters = Array.isArray(availableClusters)
    ? availableClusters.filter((cluster) =>
        cluster.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Validate record value based on type
  const validateRecord = (
    record: Record
  ): { isValid: boolean; errorMessage?: string } => {
    // Validate name
    const nameValidation = validateRecordName(record.name);
    if (!nameValidation.isValid) {
      return nameValidation;
    }

    // Validate value
    const valueValidation = validateRecordValue(record.value, record.type);
    if (!valueValidation.isValid) {
      return valueValidation;
    }

    return { isValid: true };
  };

  const addRecord = () => {
    const newRecord: Record = {
      id: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // generate a unique client-side only ID for each new record
      name: "",
      type: "STRING",
      value: "",
      isNew: true,
      originalName: "",
      originalType: "STRING",
      originalValue: "",
      modifiedFields: new Set<string>(),
    };
    setRecords((prev) => [...prev, newRecord]);
  };

  const updateRecord = (id: string, field: keyof Record, value: string) => {
    // console.log("updateRecord called with:", { id, field, value });
    setRecords((prevRecords) =>
      prevRecords.map((record) => {
        if (record.id === id) {
          // console.log("Updating record:", { recordName: record.name, field, value, recordBefore: record });
          const updatedRecord = {
            ...record,
            [field]: value,
            isModified: !record.isNew,
          };
          // console.log("Updated record:", updatedRecord);

          // Track which fields have been modified
          if (!record.isNew) {
            const modifiedFields = new Set(record.modifiedFields || []);
            
            // Check if the field actually changed from its original value
            if (field === "name" && value !== record.originalName) {
              modifiedFields.add("name");
            } else if (field === "type" && value !== record.originalType) {
              modifiedFields.add("type");
            } else if (field === "value" && value !== record.originalValue) {
              modifiedFields.add("value");
            }
            
            // Remove from modified fields if it matches original
            if (field === "name" && value === record.originalName) {
              modifiedFields.delete("name");
            } else if (field === "type" && value === record.originalType) {
              modifiedFields.delete("type");
            } else if (field === "value" && value === record.originalValue) {
              modifiedFields.delete("value");
            }
            
            updatedRecord.modifiedFields = modifiedFields;
            updatedRecord.isModified = modifiedFields.size > 0;
          }

          // If type changed, provide a default value
          if (field === "type") {
            updatedRecord.value = getDefaultValue(value as RecordDataType);
            // Also track value modification if type changed
            if (!record.isNew && updatedRecord.modifiedFields) {
              updatedRecord.modifiedFields.add("value");
              updatedRecord.originalValue = record.originalValue || record.value;
            }
          }

          // Validate the record if we're updating critical fields
          if (field === "name" || field === "type" || field === "value") {
            const validation = validateRecord(updatedRecord);
            updatedRecord.hasError = !validation.isValid;
            updatedRecord.errorMessage = validation.errorMessage;
          }

          return updatedRecord;
        }
        return record;
      })
    );
  };

  // Delete record
  const deleteRecord = (id: string) => {
    setRecords(records.filter((record) => record.id !== id));
    setSelectedRecords((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  // Delete selected records
  const deleteSelectedRecords = () => {
    setRecords(records.filter((record) => !selectedRecords.has(record.id)));
    setSelectedRecords(new Set());
  };

  // Toggle record selection
  const toggleRecordSelection = (id: string) => {
    setSelectedRecords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Select all visible records
  const selectAllRecords = () => {
    const visibleRecordIds = filteredAndSortedRecords.map(
      (record) => record.id
    );
    setSelectedRecords(new Set(visibleRecordIds));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedRecords(new Set());
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort records (only for edit mode)
  const filteredAndSortedRecords = isEditMode
    ? records
        .filter((record) => {
          const recordSearchTerm = isEditMode ? searchTerm : ""; // Use different search for records vs clusters
          const matchesSearch =
            record.name
              .toLowerCase()
              .includes(recordSearchTerm.toLowerCase()) ||
            record.value.toLowerCase().includes(recordSearchTerm.toLowerCase());
          const matchesFilter =
            filterType === "all" || record.type === filterType;
          return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
          let aValue = a[sortField];
          let bValue = b[sortField];

          if (typeof aValue === "string") aValue = aValue.toLowerCase();
          if (typeof bValue === "string") bValue = bValue.toLowerCase();

          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          return 0;
        })
    : [];

  // Calculate statistics
  const stats = {
    total: records.length,
    modified: records.filter((r) => r.isModified).length,
    new: records.filter((r) => r.isNew).length,
    errors: records.filter((r) => r.hasError).length,
  };

  // Get save status indicator
  const getSaveStatusIndicator = () => {
    switch (saveStatus) {
      case "saved":
        return (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            <span>Saved</span>
          </div>
        );
      case "saving":
        return (
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Saving...</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle size={16} />
            <span>Error saving</span>
          </div>
        );
      case "unsaved":
        return (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>Unsaved changes</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sb-amber"></div>
        <p className="mt-4 text-lg" style={{ color: "var(--text-secondary)" }}>
          {isSearchMode
            ? "Loading available clusters..."
            : "Loading cluster data..."}
        </p>
      </div>
    );
  }

  // Render search/create interface
  if (isSearchMode) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {/* Header */}
        <div
          className="border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/projects/${encodeURIComponent(
                        projectName!
                      )}/collections/${encodeURIComponent(collectionName!)}`
                    )
                  }
                  className="flex items-center gap-2 text-sb-amber hover:text-sb-amber-dark transition-colors"
                >
                  <ArrowLeft size={20} />
                  Back to Collection
                </button>
                <div className="h-6 w-px"></div>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm">
                  <button
                    onClick={navigateToProjects}
                    className="text-sb-amber hover:text-sb-amber-dark transition-colors"
                  >
                    {projectName}
                  </button>
                  <ChevronRight
                    size={16}
                    style={{ color: "var(--text-secondary)" }}
                  />
                  <button
                    onClick={navigateToCollection}
                    className="text-sb-amber hover:text-sb-amber-dark transition-colors"
                  >
                    {collectionName}
                  </button>
                  <ChevronRight
                    size={16}
                    style={{ color: "var(--text-secondary)" }}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    Cluster Editor
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="p-2 rounded-lg border-2 border-gray-400 hover:border-sb-amber transition-colors"
                  style={{ backgroundColor: "var(--bg-primary)" }}
                  title="Help"
                >
                  <HelpCircle
                    size={16}
                    style={{ color: "var(--text-secondary)" }}
                  />
                </button>

                <button
                  onClick={fetchAvailableClusters}
                  className="p-2 rounded-lg border-2 border-gray-400 hover:border-sb-amber transition-colors"
                  style={{ backgroundColor: "var(--bg-primary)" }}
                  title="Refresh"
                >
                  <RefreshCw
                    size={16}
                    style={{ color: "var(--text-secondary)" }}
                  />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle
                  size={20}
                  className="text-red-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <div className="text-red-400 font-medium">Error</div>
                  <div
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {error}
                  </div>
                </div>
                <button onClick={() => setError(null)} className="ml-auto">
                  <X size={16} className="text-red-400 hover:text-red-300" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Interface */}
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Select or Create a Cluster
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                Search for an existing cluster to edit, or create a new one
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="text"
                placeholder="Search existing clusters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-400 rounded-lg focus:border-sb-amber focus:outline-none transition-colors"
                style={{
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Create New Section */}
            <div className="mb-6">
              <button
                onClick={() => setIsCreatingNew(!isCreatingNew)}
                className="w-full flex items-center justify-between p-4 border-2 border-dashed border-gray-400 rounded-lg hover:border-sb-amber transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Plus size={20} className="text-sb-amber" />
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Create New Cluster
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isCreatingNew ? "rotate-180" : ""
                  }`}
                  style={{ color: "var(--text-secondary)" }}
                />
              </button>

              {isCreatingNew && (
                <div
                  className="mt-4 p-4 border rounded-lg"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter cluster name..."
                      value={newClusterName}
                      onChange={(e) => setNewClusterName(e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-gray-400 rounded focus:border-sb-amber focus:outline-none transition-colors"
                      style={{
                        color: "var(--text-primary)",
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCreateNewCluster()
                      }
                    />
                    <button
                      onClick={handleCreateNewCluster}
                      disabled={!newClusterName.trim()}
                      className="px-4 py-2 bg-sb-amber hover:bg-sb-amber-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
                    >
                      Create
                    </button>
                  </div>
                  <p
                    className="text-xs mt-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Cluster names can only contain letters, numbers, underscores
                    (_), and hyphens (-)
                  </p>
                </div>
              )}
            </div>

            {/* Existing Clusters */}
            {filteredClusters.length > 0 && (
              <div>
                <h3
                  className="font-medium mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Existing Clusters ({filteredClusters.length})
                </h3>
                <div className="space-y-2">
                  {filteredClusters.map((cluster) => (
                    <button
                      key={cluster.id}
                      onClick={() => handleClusterSelect(cluster.name)}
                      className="w-full p-4 text-left border-2 border-gray-400 rounded-lg hover:border-sb-amber hover:bg-sb-amber hover:bg-opacity-10 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {cluster.name}
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Records: {cluster.recordCount} ID: {cluster.id}
                          </p>
                        </div>
                        <div className="text-sb-amber">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No clusters found */}
            {searchTerm && filteredClusters.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  No clusters found
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  No clusters match "{searchTerm}". Try creating a new one
                  instead.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  async function handleConfirmClusterCreation(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate all records before sending
    const invalidRecords = records.filter((record) => {
      const validation = validateRecord(record);
      return !validation.isValid;
    });

    if (!clusterInfo?.name) {
      setError("Cluster name is required.");
      return;
    }

    if (invalidRecords.length > 0) {
      setError(
        "Please fix errors in your records before creating the cluster."
      );
      return;
    }

    try {
      setSaveStatus("saving");
      const token = await getToken();

      // Prepare the record payload
      const payload = {
        records: records.map((r) => ({
          name: r.name,
          type: r.type,
          value: r.value,
        })),
      };

      //OstrichDB POST request DO NOT send back JSON. All that needs to happen is adding the cluster name and or record name, type, and value to the URL.

      //First create the Cluster
      const clusterCreationResponse = await fetch(
        `http://localhost:8042/api/v1/projects/${encodeURIComponent(
          projectName!
        )}/collections/${encodeURIComponent(
          collectionName!
        )}/clusters/${encodeURIComponent(clusterInfo.name)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!clusterCreationResponse.ok) {
        setSaveStatus("error");
        setError("Failed to create cluster.");
        return;
      }

      //Now for each record, send a POST request to add it to the Cluster
      for (const record of payload.records) {
        const recordCreationResponse = await fetch(
          `http://localhost:8042/api/v1/projects/${encodeURIComponent(
            projectName!
          )}/collections/${encodeURIComponent(
            collectionName!
          )}/clusters/${encodeURIComponent(
            clusterInfo.name
          )}/records/${encodeURIComponent(
            record.name
          )}?type=${encodeURIComponent(record.type)}&value=${encodeURIComponent(
            record.value
          )}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!recordCreationResponse.ok) {
          setSaveStatus("error");
          setError("Failed to add record to cluster.");
          return;
        }
      }

      setSaveStatus("saved");
      setSuccessMessage("Cluster created successfully!");
      // Optionally, navigate to the new cluster's edit page with its real ID
      setTimeout(() => {
        navigate(
          `/dashboard/projects/${encodeURIComponent(
            projectName!
          )}/collections/${encodeURIComponent(
            collectionName!
          )}/cluster-editor/${encodeURIComponent(clusterInfo.name)}`
        );
      }, 1000);
    } catch (err) {
      setSaveStatus("error");
      setError(
        err instanceof Error ? err.message : "Failed to create cluster."
      );
    }
  }
  // PUT method for renaming a record
  const renameRecord = async (oldRecordName: string, newRecordName: string) => {
    try {
      const token = await getToken();
      const url = `http://localhost:8042/api/v1/projects/${encodeURIComponent(
        projectName!
      )}/collections/${encodeURIComponent(
        collectionName!
      )}/clusters/${encodeURIComponent(
        clusterName!
      )}/records/${encodeURIComponent(oldRecordName)}?rename=${encodeURIComponent(newRecordName)}`;
      
      // console.log("PUT request URL for renaming record:", url);
      // console.log("Old name:", oldRecordName, "New name:", newRecordName);
      
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      if (!response.ok) {
        console.error("PUT request failed:", response.status, responseData);
        throw new Error(`Failed to rename record: ${response.status} ${typeof responseData === 'object' && responseData?.message || responseData || 'Unknown error'}`);
      }

      return true;
    } catch (err) {
      console.error("Error renaming record:", err);
      throw err;
    }
  };

  // PUT method for updating record type
  const updateRecordType = async (recordName: string, newType: string) => {
    try {
      const token = await getToken();
      const url = `http://localhost:8042/api/v1/projects/${encodeURIComponent(
        projectName!
      )}/collections/${encodeURIComponent(
        collectionName!
      )}/clusters/${encodeURIComponent(
        clusterName!
      )}/records/${encodeURIComponent(recordName)}?type=${encodeURIComponent(newType)}`;
      
      // console.log("PUT request URL for updating record type:", url);
      // console.log("Record name:", recordName, "New type:", newType);
      
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      if (!response.ok) {
        console.error("PUT request failed:", response.status, responseData);
        throw new Error(`Failed to update record type: ${response.status} ${typeof responseData === 'object' && responseData?.message || responseData || 'Unknown error'}`);
      }

      return true;
    } catch (err) {
      console.error("Error updating record type:", err);
      throw err;
    }
  };

  // PUT method for updating record value
  const updateRecordValue = async (recordName: string, newValue: string) => {
    try {
      const token = await getToken();
      
      // Special handling for records with reserved names like "name"
      const encodedRecordName = encodeURIComponent(recordName);
      
      const url = `http://localhost:8042/api/v1/projects/${encodeURIComponent(
        projectName!
      )}/collections/${encodeURIComponent(
        collectionName!
      )}/clusters/${encodeURIComponent(
        clusterName!
      )}/records/${encodedRecordName}?value=${encodeURIComponent(newValue)}`;
      
      // console.log("PUT request URL for updating record value:", url);
      // console.log("Record name:", recordName, "Encoded record name:", encodedRecordName, "New value:", newValue);
      // console.log("Is record name 'name'?", recordName === "name");
      
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      // console.log("Response status:", response.status);
      // console.log("Response data:", responseData);

      if (!response.ok) {
        console.error("PUT request failed:", response.status, responseData);
        throw new Error(`Failed to update record value: ${response.status} ${typeof responseData === 'object' && responseData?.message || responseData || 'Unknown error'}`);
      }

      return true;
    } catch (err) {
      console.error("Error updating record value:", err);
      throw err;
    }
  };

  const handleConfirmClusterUpdate = async () => {
    try {
      setSaveStatus("saving");
      setError(null);
      
      for (const record of records) {
        if (record.isNew) {
          // For new records, send a POST request
          const token = await getToken();
          await fetch(
            `http://localhost:8042/api/v1/projects/${encodeURIComponent(
              projectName!
            )}/collections/${encodeURIComponent(
              collectionName!
            )}/clusters/${encodeURIComponent(
              clusterName!
            )}/records/${encodeURIComponent(
              record.name
            )}?type=${encodeURIComponent(
              record.type
            )}&value=${encodeURIComponent(record.value)}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
        } else if (record.isModified && record.modifiedFields) {
          // For modified records, use specific PUT methods based on what changed
          const modifiedFields = record.modifiedFields;
          
          // Handle renaming first (if name changed)
          if (modifiedFields.has("name") && record.originalName) {
            await renameRecord(record.originalName, record.name);
            // Update the original name after successful rename
            record.originalName = record.name;
          }
          
          // Handle type change
          if (modifiedFields.has("type")) {
            await updateRecordType(record.name, record.type);
            // Update the original type after successful update
            record.originalType = record.type;
          }
          
          // Handle value change
          if (modifiedFields.has("value")) {
            await updateRecordValue(record.name, record.value);
            // Update the original value after successful update
            record.originalValue = record.value;
          }
        }
      }
      
      // Update records state to reflect successful save
      setRecords((prev) =>
        prev.map((record) => ({
          ...record,
          isNew: false,
          isModified: false,
          modifiedFields: new Set<string>(),
          originalName: record.name,
          originalType: record.type,
          originalValue: record.value,
        }))
      );
      
      setSaveStatus("saved");
      setSuccessMessage("Changes saved!");
      fetchRecordsInCluster();
    } catch (err) {
      setSaveStatus("error");
      setError(err instanceof Error ? err.message : "Failed to save changes");
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="border-b" style={{ borderColor: "var(--border-color)" }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={navigateToCollection}
                className="flex items-center gap-2 text-sb-amber hover:text-sb-amber-dark transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Collection
              </button>
              <div className="h-6 w-px"></div>

              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={navigateToProjects}
                  className="text-sb-amber hover:text-sb-amber-dark transition-colors"
                >
                  {projectName}
                </button>
                <ChevronRight
                  size={16}
                  style={{ color: "var(--text-secondary)" }}
                />
                <button
                  onClick={navigateToCollection}
                  className="text-sb-amber hover:text-sb-amber-dark transition-colors"
                >
                  {collectionName}
                </button>
                <ChevronRight
                  size={16}
                  style={{ color: "var(--text-secondary)" }}
                />
                <span style={{ color: "var(--text-primary)" }}>
                  {clusterInfo?.name}
                </span>
              </div>
            </div>

            {/* Right side - Save status */}
            <div className="flex items-center gap-4">
              {getSaveStatusIndicator()}
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle
                size={20}
                className="text-red-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <div className="text-red-400 font-medium">Error</div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {error}
                </div>
              </div>
              <button onClick={() => setError(null)} className="ml-auto">
                <X size={16} className="text-red-400 hover:text-red-300" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle
                size={20}
                className="text-green-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <div className="text-green-400 font-medium">Success</div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {successMessage}
                </div>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-auto"
              >
                <X size={16} className="text-green-400 hover:text-green-300" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cluster Information Section */}
      <div
        className="border-b px-6 py-4"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="max-w-4xl">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Cluster Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Cluster Name
              </label>
              <input
                type="text"
                value={clusterInfo?.name || clusterName || ""}
                readOnly={isEditMode}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                  isEditMode
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                    : "border-gray-400 focus:border-sb-amber"
                }`}
                style={{
                  backgroundColor: isEditMode
                    ? "var(--bg-primary)"
                    : "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
                placeholder="Enter cluster name..."
              />
              {isEditMode && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Cluster name cannot be changed after creation
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Cluster ID
              </label>
              <input
                type="text"
                value={clusterInfo?.id || "Will be assigned after creation"}
                readOnly
                className="w-full px-4 py-2 border-2 border-gray-300 bg-gray-100 rounded-lg cursor-not-allowed"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-secondary)",
                }}
              />
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Unique identifier assigned by the system
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar with Search, Filter, and Action Buttons */}
      <div
        className="border-b px-6 py-4"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-400 rounded-lg focus:border-sb-amber focus:outline-none transition-colors"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-400 rounded-lg hover:border-sb-amber transition-colors"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <Filter size={16} />
                <span>
                  Filter: {filterType === "all" ? "All Types" : filterType}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isFilterOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 border-2 border-gray-400 rounded-lg shadow-lg z-10"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <button
                    onClick={() => {
                      setFilterType("all");
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-sb-amber hover:text-black transition-colors first:rounded-t-md"
                    style={{ color: "var(--text-primary)" }}
                  >
                    All Types
                  </button>
                  {Object.entries(dataTypeCategories).map(
                    ([category, types]) => (
                      <div key={category}>
                        <div
                          className="px-4 py-2 text-xs font-medium text-gray-500 border-t first:border-t-0"
                          style={{ borderColor: "var(--border-color)" }}
                        >
                          {category}
                        </div>
                        {types.map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setFilterType(type);
                              setIsFilterOpen(false);
                            }}
                            className="w-full text-left px-6 py-2 hover:bg-sb-amber hover:text-black transition-colors text-sm"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div
              className="flex items-center gap-4 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>{stats.total} total</span>
              {stats.new > 0 && (
                <span className="text-blue-400">{stats.new} new</span>
              )}
              {stats.modified > 0 && (
                <span className="text-yellow-400">
                  {stats.modified} modified
                </span>
              )}
              {stats.errors > 0 && (
                <span className="text-red-400">{stats.errors} errors</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Selection actions */}
            {selectedRecords.size > 0 && (
              <>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {selectedRecords.size} selected
                </span>
                <button
                  onClick={deleteSelectedRecords}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Delete Selected
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-2 border-2 border-gray-400 rounded-lg text-sm font-medium hover:border-sb-amber transition-colors"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  Clear Selection
                </button>
              </>
            )}

            {/* Action buttons */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-lg border-2 border-gray-400 hover:border-sb-amber transition-colors"
              style={{ backgroundColor: "var(--bg-primary)" }}
              title="Help"
            >
              <HelpCircle
                size={16}
                style={{ color: "var(--text-secondary)" }}
              />
            </button>

            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg border-2 border-gray-400 hover:border-sb-amber transition-colors"
              style={{ backgroundColor: "var(--bg-primary)" }}
              title="Refresh"
            >
              <RefreshCw size={16} style={{ color: "var(--text-secondary)" }} />
            </button>

            <button
              onClick={() => setShowRawModal(true)}
              className="flex items-center gap-2 px-3 py-2 border-2 border-gray-400 hover:border-sb-amber transition-colors rounded-lg"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
              }}
              title="View Raw Format"
            >
              <span className="text-xs font-mono">{}</span>
              <span className="text-sm">Raw</span>
            </button>

            <button
              onClick={addRecord}
              className="flex items-center gap-2 px-4 py-2 bg-sb-amber hover:bg-sb-amber-dark text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={16} />
              Add Record
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--border-color)" }}
          >
            {/* Table Header */}
            <div
              className="border-b"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              <div
                className="grid grid-cols-12 gap-4 p-4 font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedRecords.size ===
                        filteredAndSortedRecords.length &&
                      filteredAndSortedRecords.length > 0
                    }
                    onChange={
                      selectedRecords.size === filteredAndSortedRecords.length
                        ? clearSelection
                        : selectAllRecords
                    }
                    className="rounded"
                  />
                </div>
                <div className="col-span-3">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 hover:text-sb-amber transition-colors"
                  >
                    Record Name
                    {sortField === "name" && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => handleSort("type")}
                    className="flex items-center gap-1 hover:text-sb-amber transition-colors"
                  >
                    Type
                    {sortField === "type" && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                </div>
                <div className="col-span-5">
                  <button
                    onClick={() => handleSort("value")}
                    className="flex items-center gap-1 hover:text-sb-amber transition-colors"
                  >
                    Value
                    {sortField === "value" && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                </div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div style={{ backgroundColor: "var(--bg-primary)" }}>
              {filteredAndSortedRecords.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    No records found
                  </h3>
                  <p
                    className="text-lg mb-6"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {searchTerm || filterType !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Add your first record to get started"}
                  </p>
                  {!searchTerm && filterType === "all" && (
                    <button onClick={addRecord} className="btn btn-primary">
                      Add First Record
                    </button>
                  )}
                </div>
              ) : (
                filteredAndSortedRecords.map((record) => (
                  <div
                    key={record.id}
                    className={`grid grid-cols-12 gap-4 p-4 border-b transition-colors ${
                      record.hasError
                        ? "bg-red-900/10 border-red-500/20"
                        : record.isNew
                        ? "bg-blue-900/10 border-blue-500/20"
                        : record.isModified
                        ? "bg-yellow-900/10 border-yellow-500/20"
                        : ""
                    }`}
                    style={{ borderBottomColor: "var(--border-color)" }}
                  >
                    {/* Checkbox */}
                    <div className="col-span-1 flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRecords.has(record.id)}
                        onChange={() => toggleRecordSelection(record.id)}
                        className="rounded"
                      />
                    </div>

                    {/* Record Name */}
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={record.name}
                        onChange={(e) =>
                          updateRecord(record.id, "name", e.target.value)
                        }
                        placeholder="record_name"
                        className={`w-full px-3 py-2 border rounded focus:outline-none transition-colors ${
                          record.hasError &&
                          record.errorMessage?.includes("name")
                            ? "border-red-500 focus:border-red-400"
                            : "border-gray-400 focus:border-sb-amber"
                        }`}
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>

                    {/* Record Type */}
                    <div className="col-span-2">
                      <select
                        value={record.type}
                        onChange={(e) =>
                          updateRecord(record.id, "type", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-400 rounded focus:border-sb-amber focus:outline-none transition-colors"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {Object.entries(dataTypeCategories).map(
                          ([category, types]) => (
                            <optgroup key={category} label={category}>
                              {types.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </optgroup>
                          )
                        )}
                      </select>
                    </div>

                    {/* Record Value */}
                    <div className="col-span-5">
                      <input
                        {...getInputPropsForType(record.type)}
                        value={record.value}
                        onChange={(e) =>
                          updateRecord(record.id, "value", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded focus:outline-none transition-colors ${
                          record.hasError &&
                          record.errorMessage?.includes("Value")
                            ? "border-red-500 focus:border-red-400"
                            : "border-gray-400 focus:border-sb-amber"
                        }`}
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          color: "var(--text-primary)",
                        }}
                      />
                      {record.hasError && record.errorMessage && (
                        <div className="text-xs text-red-400 mt-1">
                          {record.errorMessage}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

     {/* Help Modal */}
     {showHelpModal && (
       <div 
         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         onClick={() => setShowHelpModal(false)}
       >
         <div
           className="max-w-2xl w-full rounded-lg p-6 max-h-[80vh] overflow-y-auto"
           style={{
             backgroundColor: "var(--bg-primary)",
             borderColor: "var(--border-color)",
           }}
           onClick={(e) => e.stopPropagation()}
         >
           <div className="flex items-center justify-between mb-6">
             <h2
               className="text-xl font-bold"
               style={{ color: "var(--text-primary)" }}
             >
               Cluster Editor Help
             </h2>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} style={{ color: "var(--text-secondary)" }} />
              </button>
            </div>

            <div
              className="space-y-6"
              style={{ color: "var(--text-secondary)" }}
            >
              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Auto-Save
                </h3>
                <p className="text-sm mb-2">
                  Your changes are automatically saved as you type. Look for the
                  save status indicator in the top-right corner:
                </p>
                <ul className="text-sm list-disc list-inside ml-4 space-y-1">
                  <li>
                    <span className="text-green-400">✓ Saved</span> - All
                    changes have been saved
                  </li>
                  <li>
                    <span className="text-yellow-400">⏳ Saving...</span> -
                    Currently saving your changes
                  </li>
                  <li>
                    <span className="text-red-400">⚠️ Error saving</span> -
                    There was an error, check for validation issues
                  </li>
                  <li>
                    <span className="text-gray-400">• Unsaved changes</span> -
                    Changes detected, will save shortly
                  </li>
                </ul>
              </div>

              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Data Types
                </h3>
                <div className="space-y-4">
                  {Object.entries(dataTypeCategories).map(
                    ([category, types]) => (
                      <div key={category}>
                        <h4 className="font-medium text-sb-amber mb-2">
                          {category}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {types.map((type) => (
                            <div key={type} className="flex justify-between">
                              <span className="font-mono">{type}</span>
                              <span className="text-xs">
                                {DATA_TYPE_DESCRIPTIONS[type]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Examples
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-mono">STRING:</span>{" "}
                    {DATA_TYPE_EXAMPLES.STRING}
                  </div>
                  <div>
                    <span className="font-mono">INTEGER:</span>{" "}
                    {DATA_TYPE_EXAMPLES.INTEGER}
                  </div>
                  <div>
                    <span className="font-mono">BOOLEAN:</span>{" "}
                    {DATA_TYPE_EXAMPLES.BOOLEAN}
                  </div>
                  <div>
                    <span className="font-mono">DATE:</span>{" "}
                    {DATA_TYPE_EXAMPLES.DATE}
                  </div>
                  <div>
                    <span className="font-mono">TIME:</span>{" "}
                    {DATA_TYPE_EXAMPLES.TIME}
                  </div>
                  <div>
                    <span className="font-mono">DATETIME:</span>{" "}
                    {DATA_TYPE_EXAMPLES.DATETIME}
                  </div>
                  <div>
                    <span className="font-mono">UUID:</span>{" "}
                    {DATA_TYPE_EXAMPLES.UUID}
                  </div>
                  <div>
                    <span className="font-mono">[]STRING:</span>{" "}
                    {DATA_TYPE_EXAMPLES["[]STRING"]}
                  </div>
                </div>
              </div>

              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Tips
                </h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>
                    Record names can only contain letters, numbers, underscores
                    (_), and hyphens (-)
                  </li>
                  <li>Array values must be valid JSON arrays</li>
                  <li>Boolean values must be exactly "true" or "false"</li>
                  <li>Dates use YYYY-MM-DD format</li>
                  <li>Times use HH:MM:SS format (24-hour)</li>
                  <li>DateTime combines both with a T separator</li>
                  <li>UUIDs must follow standard format with hyphens</li>
                  <li>
                    Changes are automatically saved - no need to manually save
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full px-4 py-2 bg-sb-amber hover:bg-sb-amber-dark text-white rounded-lg font-medium transition-colors"
              >
                Close Help
              </button>
            </div>

            <div
              className="mt-6 text-sm text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              Need more help? Contact support or check our{" "}
              <a href="/docs" className="text-sb-amber hover:underline">
                documentation
              </a>
              .
            </div>
          </div>
        </div>
      )}

  {/* Raw View Modal */}
  {showRawModal && (
       <div 
         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         onClick={() => setShowRawModal(false)}
       >
         <div
           className="max-w-4xl w-full rounded-lg p-6 max-h-[80vh] overflow-y-auto"
           style={{
             backgroundColor: "var(--bg-primary)",
             borderColor: "var(--border-color)",
           }}
           onClick={(e) => e.stopPropagation()}
         >
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <h2
                 className="text-xl font-bold"
                 style={{ color: "var(--text-primary)" }}
               >
                  Raw Cluster Format
                </h2>
                <span className="text-sm px-2 py-1 bg-sb-amber text-black rounded font-mono">
                  {clusterInfo?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateRawFormat());
                    setSuccessMessage("Raw format copied to clipboard!");
                    setTimeout(() => setSuccessMessage(null), 3000);
                  }}
                  className="px-3 py-1 text-sm bg-sb-amber hover:bg-sb-amber-dark text-black rounded font-medium transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={() => setShowRawModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} style={{ color: "var(--text-secondary)" }} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Physical File Representation
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  This is how your cluster data appears in the actual file
                  structure. Each record follows the format:{" "}
                  <span
                    className="px-1 rounded"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    name :TYPE: value
                  </span>
                </p>
              </div>

              <div className="relative">
                <pre
                  className="p-4 rounded-lg border-2 text-sm font-mono overflow-x-auto whitespace-pre"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  {generateRawFormat()}
                </pre>

                {/* Syntax highlighting overlay could go here in the future */}
                <div className="absolute top-2 right-2">
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {records.length} records
                  </span>
                </div>
              </div>

              <div
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                <p>
                  <strong>Format Rules:</strong>
                </p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>
                    Cluster metadata uses <code>:identifier:</code> type
                  </li>
                  <li>
                    Each record follows <code>name :TYPE: value</code> pattern
                  </li>
                  <li>
                    Array values are displayed as comma-separated lists in
                    brackets
                  </li>
                  <li>Empty or invalid records are automatically excluded</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setShowRawModal(false)}
                className="flex-1 px-4 py-2 bg-sb-amber hover:bg-sb-amber-dark text-black rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation button */}
      {isEditMode && (
        <div className="p-6 flex justify-center max-w-2xl mx-auto  ">
          <button
            onClick={
              isNewCluster
                ? handleConfirmClusterCreation
                : handleConfirmClusterUpdate
            }
            className="mt-6 px-6 py-3 bg-sb-amber hover:bg-sb-amber-dark text-white rounded font-medium transition-colors"
            disabled={
              saveStatus === "saving" ||
              (!isNewCluster && saveStatus !== "unsaved")
            }
          >
            {saveStatus === "saving"
              ? "Saving..."
              : isNewCluster
              ? "Confirm Cluster Creation"
              : "Confirm Changes"}
          </button>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {successMessage && (
            <div className="mt-4 text-green-500">{successMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClusterEditor;