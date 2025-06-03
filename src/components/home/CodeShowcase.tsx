// src/components/home/APIShowcase.tsx
import React, { useState } from "react";

const CodeShowcase: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);

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
    },
    {
      id: 3,
      title: "📊 Sort & Paginate",
      description: "Organize results your way",
      route: "GET /api/v1/projects/.../records?sortBy=price&limit=10",
      code: `// Sort by price, ascending
GET .../records?sortBy=price&sortOrder=asc

// Paginate results
GET .../records?limit=10&offset=20

// Combine filters
GET .../records?type=INTEGER&sortBy=value&limit=5`,
      color: "from-orange-500 to-orange-600"
    },
    {
      id: 4,
      title: "🎯 Get Specific Data", 
      description: "Access exactly what you need",
      route: "GET /api/v1/projects/.../records/laptop-pro",
      code: `// Get specific record by name
GET .../records/laptop-pro

// Get record by ID
GET .../records/123

// Get entire cluster
GET .../clusters/electronics`,
      color: "from-red-500 to-red-600"
    },
    {
      id: 5,
      title: "🔄 Update & Manage",
      description: "Modify data safely",
      route: "PUT /api/v1/projects/.../records/laptop-pro",
      code: `// Update record value
PUT .../records/laptop-pro?value="MacBook Pro M3"

// Change data type (with conversion)
PUT .../records/price?newType=FLOAT&value=2499.99

// Rename records
PUT .../records/old-name?newName=new-name`,
      color: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>
            <span className="gradient-text">APIs </span>
               Thats Make Sense
          </h2>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Your data structure mirrors your API structure. Hover to explore different operations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Selection Menu - Fighter Game Style */}
          <div className="lg:col-span-1">
            <div 
              className="rounded-lg overflow-hidden border-2"
              style={{ 
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)"
              }}
            >
              {apiExamples.map((example, index) => (
                <div
                  key={example.id}
                  className={`p-4 cursor-pointer transition-all duration-300 border-b relative overflow-hidden
                    ${activeSection === index 
                      ? 'bg-sb-amber/10 border-sb-amber' 
                      : 'hover:bg-sb-amber/5'
                    }`}
                  style={{ 
                    borderBottomColor: activeSection === index ? '#E08A2C' : 'var(--border-color)'
                  }}
                  onMouseEnter={() => setActiveSection(index)}
                >
                  {/* Selection indicator */}
                  {activeSection === index && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-sb-amber"></div>
                  )}
                  
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{example.title.split(' ')[0]}</span>
                    <div>
                      <h3 
                        className={`font-medium text-sm transition-colors
                          ${activeSection === index ? 'text-sb-amber' : ''}`}
                        style={{ 
                          color: activeSection === index ? undefined : "var(--text-primary)" 
                        }}
                      >
                        {example.title.split(' ').slice(1).join(' ')}
                      </h3>
                      <p 
                        className="text-xs mt-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {example.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Display Area */}
          <div className="lg:col-span-2">
            <div 
              className="rounded-lg p-6 h-full min-h-[400px]"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              {/* Route display */}
              <div className="mb-4">
                <span 
                  className="text-xs uppercase tracking-wide font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Example Route
                </span>
                <div 
                  className="mt-2 p-3 rounded bg-black/20 font-mono text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span className="text-sb-amber">{apiExamples[activeSection].route}</span>
                </div>
              </div>

              {/* Code example */}
              <div>
                <span 
                  className="text-xs uppercase tracking-wide font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Code Example
                </span>
                <div 
                  className="mt-2 p-4 rounded bg-black/20 font-mono text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  <pre className="whitespace-pre-wrap">
                    <code className="text-sb-cream">
                      {apiExamples[activeSection].code}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Visual indicator */}
              <div className="mt-6 flex items-center">
                <div 
                  className={`w-3 h-3 rounded-full mr-3 bg-gradient-to-r ${apiExamples[activeSection].color}`}
                ></div>
                <span 
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {apiExamples[activeSection].title} • {apiExamples[activeSection].description}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeShowcase;