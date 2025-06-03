/**
 * =================================================
 * #Author: Marshall A. Burns
 * GitHub: @SchoolyB
 * #Contributors:
 *           
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * #File Description:
 *    Contains the CodeComparison component for the homepage.
 * =================================================
 **/

import React, { useState } from "react";

const CodeComparison: React.FC = () => {
  const [activeExample, setActiveExample] = useState(0);

  const comparisons = [
    {
      title: "Finding User Orders",
      mongodb: `// MongoDB - 15 lines of aggregation hell
db.orders.aggregate([
  { $match: { userId: "123", status: "active" } },
  { $lookup: { 
      from: "products", 
      localField: "productId",
      foreignField: "_id",
      as: "product" 
    }
  },
  { $unwind: "$product" },
  { $lookup: {
      from: "users",
      localField: "userId", 
      foreignField: "_id",
      as: "user"
    }
  },
  { $project: { ... } }
])`,
      ostrichdb: `// OstrichDB - 1 intuitive line
GET /projects/shop/collections/orders/clusters/active/records?user=123

// That's it. No joins, no aggregations.
// Your data structure IS your query structure.`
    },
    {
      title: "Type Safety",
      mongodb: `// MongoDB - Runtime surprises await

{
  "name": "Marshall", //String? Maybe?
  "age": "30", //Wait, this should be a number!
  "hobbies": "["programming", "gaming"]", //Array or String?!?
  "height": 6.2 //Float? I guess so...
}

// Hope you like try/catch blocks everywhere...`,
      ostrichdb: `// OstrichDB - Guaranteed types

{
  cluster_name :identifer: marshall
  cluster_id :identifer: 1

  name :STRING: "Marshall"
  age :INTEGER: 30
  hobbies :[]STRING: ["programming","gaming"]
  height :FLOAT: 6.2
}

// Zero runtime surprises. Ever.`
    }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Stop Fighting Your Database
          </h2>
          <div className="flex justify-center space-x-4 mb-8">
            {comparisons.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveExample(index)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeExample === index 
                    ? 'bg-sb-amber text-black' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {comparisons[index].title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* MongoDB Hell */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">❌</span>
              </div>
              <h3 className="text-xl font-bold text-gray-400">MongoDB Way</h3>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-4">
              <pre className="text-sm text-gray-400 overflow-x-auto">
                <code>{comparisons[activeExample].mongodb}</code>
              </pre>
            </div>
            
            <div className="text-gray-500 text-md">
              😤 Annoying • 🐛 Error-prone
            </div>
          </div>

          {/* OstrichDB Way */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-sb-amber rounded flex items-center justify-center">
                <span className="text-black text-xs font-bold">✅</span>
              </div>
              <h3 className="text-xl font-bold text-sb-amber">OstrichDB Way</h3>
            </div>
            
            <div className="bg-sb-amber/10 border border-sb-amber/30 rounded-lg p-4">
              <pre className="text-sm text-sb-amber overflow-x-auto">
                <code>{comparisons[activeExample].ostrichdb}</code>
              </pre>
            </div>
            
            <div className="text-sb-amber text-md">
              😌 Simple • 🛡️ Type-safe
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CodeComparison;