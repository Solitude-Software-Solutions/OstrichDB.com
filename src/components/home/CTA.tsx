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
*    Contains the CTA (Call to Action) component for user conversion.
* =================================================
**/

import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-24 bg-sb-dark relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sb-amber/50 to-transparent"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-sb-cream/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-sb-amber/10 rounded-full blur-3xl"></div>
      
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Start building with <span className="gradient-text">OstrichDB</span> today
          </h2>
          <p className="text-xl mb-10" style={{ color: 'var(--text-primary)' }}>
            Join thousands of developers and teams using OstrichDB to build their applications faster and more securely.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#" className="btn btn-primary py-3 px-8 text-base">
              Start your project
            </a>
            <a href="#" className="btn btn-outline py-3 px-8 text-base group">
              <span>Documentation</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;