/**
* =================================================
* #Author: Kasi Reeves
* GitHub: @Kasirocswell  
* #Contributors: 
*           @SchoolyB
* 
* License: Apache License 2.0 (see LICENSE file for details)
* Copyright (c) 2025-Present Archetype Dynamics, Inc.
* #File Description:
*    Contains the Hero component for the landing page with animated code display.
* =================================================
**/


import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!codeRef.current) return;

    const typeCode = async (element: HTMLDivElement, text: string, speed: number = 20) => {
      for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    };

    const initAnimation = async () => {
      const codeElement = codeRef.current;
      if (!codeElement) return;

      codeElement.textContent = '';

      const codeSnippet = `
// Initialize OstrichDB client
const OstrichDB = createClient(
  'https://example.OstrichDB.co',
  'public-key'
)

// Fetch data with a single line
const { data, error } = await OstrichDB
  .from('users')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10)

// Real-time subscriptions
const channel = OstrichDB
  .channel('changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'users' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()`;

      await typeCode(codeElement, codeSnippet);
    };

    initAnimation();
  }, []);

  return (
    <div className="relative min-h-screen pt-24 hero-gradient">
      <div className="container pb-20 pt-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span style={{ color: 'var(--text-primary)' }} className="block">Your All In One</span>
            <span className="text-sb-amber block">Backend Solutuion</span> 
          </h1>
          <p style={{ color: 'var(--text-primary)' }} className="text-xl md:text-2xl mb-8 leading-relaxed">
            Build in a weekend. Scale to millions. OstrichDB is an open source MongoDB alternative for building production-grade applications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#" className="btn btn-primary py-3 px-6 text-base">
              Start your project
            </a>
            <a href="#" className="btn btn-outline py-3 px-6 text-base group">
              <span>Documentation</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-sb-dark-accent rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-gray-700">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4 text-sm text-gray-400">OstrichDB-client.js</div>
            </div>
            <div className="p-4 overflow-auto">
              <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                <div ref={codeRef}></div>
              </pre>
            </div>
          </div>
        </div>
      </div>
    
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sb-dark to-transparent"></div>
    </div>
  );
};

export default Hero;