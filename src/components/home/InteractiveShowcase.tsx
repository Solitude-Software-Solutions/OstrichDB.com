/**
 * =================================================
 * #Author: Marshall A Burns
 * GitHub: @SchoolyB
 * #Contributors:
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * #File Description:
 *    Interactive showcase component with API/GUI toggle functionality.
 * =================================================
 **/

import React, { useState } from "react";
import ClusterEditor from "./SampleClusterEditor";
import TerminalQueryEditor from "./SampleQueryEditor";

const InteractiveShowcase: React.FC = () => {
  const [activeMode, setActiveMode] = useState("GUI"); // "API" or "GUI"
  const [activeSection, setActiveSection] = useState(0);

  // API examples
  const apiExamples = [
    {
      id: 0,
      title: "🏗️ Create Structure",
      description: "Build your data hierarchy",
      route: "POST /api/v1/projects/ecommerce/collections/products",
      code: `// Create a new collection
POST /api/v1/projects/ecommerce/collections/products

// Create clusters within it  
POST /api/v1/projects/ecommerce/collections/products/clusters/electronics
POST /api/v1/projects/ecommerce/collections/products/clusters/clothing`,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 1,
      title: "📝 Add Records",
      description: "Insert strongly-typed data",
      route: "POST /api/v1/projects/.../records/laptop-pro",
      code: `// Add a product record
POST /api/v1/projects/ecommerce/collections/products/clusters/electronics/records/laptop-pro
?type=STRING&value="MacBook Pro"

// Strongly typed - guaranteed INTEGER
POST .../records/price?type=INTEGER&value=2499`,
      color: "from-green-500 to-green-600"
    },
    {
      id: 2,
      title: "🔍 Search & Filter",
      description: "Query with intuitive parameters",
      route: "GET /api/v1/projects/.../records?search=macbook",
      code: `// Search by name
GET /collections/products/clusters/electronics/records?search=macbook

// Filter by type  
GET .../records?type=STRING&valueContains=pro

// Price range
GET .../records?minValue=1000&maxValue=3000`,
      color: "from-purple-500 to-purple-600"
    }
  ];

  // GUI examples - Updated to use Terminal instead of Data Visualization
  const guiExamples = [
    {
      id: 0,
      title: "🎨 Visual Cluster Editor",
      description: "Create and organize data clusters visually",
      component: "cluster-editor"
    },
    {
      id: 1,
      title: "🗣️ Natural Language Query",
      description: "Ask questions in plain English",
      component: "nlq-editor"
    },
    {
      id: 2,
      title: "💻 Manual Query Editor",
      description: "Write and execute queries in a web based terminal",
      component: "query-editor"
    }
  ];

  const currentExamples = activeMode === "API" ? apiExamples : guiExamples;

  const NLQEditor = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-100 mb-2">Natural Language Queries</h3>
        <p className="text-gray-400 text-sm">Ask questions in plain English</p>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
        <div className="mb-4">
          <label className="text-xs text-gray-400 uppercase tracking-wide">Try asking:</label>
        </div>
        <textarea
          placeholder="Show me all users who signed up in the last 30 days and have made at least one purchase..."
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none"
        />
        <button className="mt-3 bg-amber-600 hover:bg-amber-700 text-white rounded px-4 py-2 text-sm font-medium transition-colors">
          Execute Query
        </button>
      </div>
      
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600 border-dashed">
        <div className="text-xs text-gray-400 mb-2">Example queries:</div>
        <div className="space-y-2">
          <div className="text-sm text-gray-300 cursor-pointer hover:text-amber-300 transition-colors">
            • "Find all orders over $100 from this month"
          </div>
          <div className="text-sm text-gray-300 cursor-pointer hover:text-amber-300 transition-colors">
            • "Show me users who haven't logged in for 90 days"
          </div>
          <div className="text-sm text-gray-300 cursor-pointer hover:text-amber-300 transition-colors">
            • "Delete all test data from the staging cluster"
          </div>
        </div>
      </div>
    </div>
  );

  const renderGUIContent = () => {
    const example = guiExamples[activeSection];
    switch (example.component) {
      case "cluster-editor":
        return <ClusterEditor />;
      case "nlq-editor":
        return <NLQEditor />;
      case "query-editor":
        return <TerminalQueryEditor />;
      default:
        return <ClusterEditor />;
    }
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-100">
            <span className="text-amber-500">Experience </span>
            OstrichDB
          </h2>
          <p className="text-lg text-gray-300">
            Choose your interface: Visual tools for everyone, APIs for developers
          </p>
          
          {/* Mode Toggle */}
          <div className="flex justify-center mt-8">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => {setActiveMode("GUI"); setActiveSection(0);}}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeMode === "GUI" 
                    ? 'bg-amber-600 text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Visual Interface
              </button>
              <button
                onClick={() => {setActiveMode("API"); setActiveSection(0);}}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeMode === "API" 
                    ? 'bg-amber-600 text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Developer API
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Selection Menu */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              {currentExamples.map((example, index) => (
                <div
                  key={example.id}
                  className={`p-4 cursor-pointer transition-all duration-300 border-b border-gray-700 relative overflow-hidden
                    ${activeSection === index 
                      ? 'bg-amber-600/10 border-amber-500' 
                      : 'hover:bg-amber-600/5'
                    }`}
                  onMouseEnter={() => setActiveSection(index)}
                >
                  {/* Selection indicator */}
                  {activeSection === index && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-amber-500"></div>
                  )}
                  
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{example.title.split(' ')[0]}</span>
                    <div>
                      <h3 className={`font-medium text-sm transition-colors
                          ${activeSection === index ? 'text-amber-400' : 'text-gray-200'}`}>
                        {example.title.split(' ').slice(1).join(' ')}
                      </h3>
                      <p className="text-xs mt-1 text-gray-400">
                        {example.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Display Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 h-full min-h-[500px] border border-gray-700">
              {activeMode === "API" ? (
                <>
                  {/* Route display */}
                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-wide font-medium text-gray-400">
                      Example Route
                    </span>
                    <div className="mt-2 p-3 rounded bg-black/20 font-mono text-sm text-gray-200">
                      <span className="text-amber-400">{apiExamples[activeSection].route}</span>
                    </div>
                  </div>

                  {/* Code example */}
                  <div>
                    <span className="text-xs uppercase tracking-wide font-medium text-gray-400">
                      Code Example
                    </span>
                    <div className="mt-2 p-4 rounded bg-black/20 font-mono text-sm leading-relaxed">
                      <pre className="whitespace-pre-wrap">
                        <code className="text-gray-300">
                          {apiExamples[activeSection].code}
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Visual indicator */}
                  <div className="mt-6 flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 bg-gradient-to-r ${apiExamples[activeSection].color}`}></div>
                    <span className="text-sm text-gray-400">
                      {apiExamples[activeSection].title} • {apiExamples[activeSection].description}
                    </span>
                  </div>
                </>
              ) : (
                renderGUIContent()
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveShowcase;