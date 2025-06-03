/**
 * =================================================
 * #Author: Kasi Reeves
 * GitHub: @Kasirocswell
 * #Contributors:
 *           @SchoolyB
 *           @GaleSSalazar
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * #File Description:
 *    Contains the Features component with hover reveal effects.
 * =================================================
 **/

import React from "react";

const features = [
  
  {
    id: 1,
    emoji: "🎨",
    name: "Visual Design",
    description: "Build and mange databases through a clean, intuitive interface."
  },
  {
    id: 2,
    emoji: "🗣️",
    name: "Natural Language Queries",
    description: "Make queurying data as easy as asking a question. No SQL, no syntax, just results."
  },
  {
    id: 3,
    emoji: "🚀",
    name: "Zero Setup",
    description: "Start building immediately - no configuration required"
  },
  {
    id: 4,
    emoji: "🏗️",
    name: "Hierarchical by Design",
    description: "Projects → Collections → Clusters → Records. Organize data the way you think about it."
  },
  {
    id: 5,
    emoji: "💪",
    name: "Strongly Typed Records",
    description: "Every Record has a guaranteed type: STRING, INTEGER, BOOLEAN, arrays of any type. Zero runtime surprises."
  },
  {
    id: 6,
    emoji: "🔒",
    name: "Secure by Default",
    description: "Built-in AES-256 encryption per Collection. User-controlled keys. No enterprise upsells required."
  },
  {
    id: 7,
    emoji: "⚡",
    name: "Native Performance",
    description: "Written in Odin, compiled to native code. No VM overhead, no JavaScript bottlenecks. Just fast."
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Why <span className="gradient-text">Ostrich</span>
            <span>DB</span> Is Different
          </h2>

          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Structure, Safety, & Speed
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {features.map((feature) => {
            return (
              <div
                key={feature.id}
                className="bg-gradient-to-br p-px rounded-lg group cursor-pointer min-h-[350px]"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, var(--bg-secondary), var(--bg-primary))`,
                }}
              >
                <div
                  className="rounded-lg p-10 h-full transition-all duration-500 ease-in-out relative overflow-hidden"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  {/* Default state - Emoji + Title */}
                  <div className="group-hover:opacity-0 group-hover:transform group-hover:-translate-y-4 transition-all duration-500 ease-in-out flex flex-col items-center justify-center h-full">
                    <div className="text-6xl mb-6">
                      {feature.emoji}
                    </div>
                    <h3
                      className="text-xl font-medium text-center"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {feature.name}
                    </h3>
                  </div>

                  {/* Hover state - Only emoji and description */}
                  <div className="absolute inset-10 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out flex flex-col items-center justify-center">
                    <div className="text-4xl mb-6">{feature.emoji}</div>
                    
                    {/* Special tree structure for hierarchical feature */}
                    {feature.id === 4 ? (
                      <div>
                        <div className="flex flex-col items-center space-y-2 mb-4">
                          <div
                            className="text-sm font-medium px-3 py-1 rounded"
                            style={{ 
                              color: "var(--text-primary)",
                              backgroundColor: "var(--bg-primary)"
                            }}
                          >
                            Projects
                          </div>
                          <div className="text-sb-amber">↓</div>
                          <div
                            className="text-sm font-medium px-3 py-1 rounded"
                            style={{ 
                              color: "var(--text-primary)",
                              backgroundColor: "var(--bg-primary)"
                            }}
                          >
                            Collections
                          </div>
                          <div className="text-sb-amber">↓</div>
                          <div
                            className="text-sm font-medium px-3 py-1 rounded"
                            style={{ 
                              color: "var(--text-primary)",
                              backgroundColor: "var(--bg-primary)"
                            }}
                          >
                            Clusters
                          </div>
                          <div className="text-sb-amber">↓</div>
                          <div
                            className="text-sm font-medium px-3 py-1 rounded"
                            style={{ 
                              color: "var(--text-primary)",
                              backgroundColor: "var(--bg-primary)"
                            }}
                          >
                            Records
                          </div>
                        </div>
                        <p 
                          className="text-sm leading-relaxed text-center"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Organize data the way you think about it..
                        </p>
                      </div>
                    ) : (
                      <p 
                        className="text-xl leading-relaxed text-center"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;