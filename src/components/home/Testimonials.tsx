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
*    Contains the Testimonials component for displaying customer reviews.
* =================================================
**/

import React from 'react';
import { testimonials } from '../../data/testimonials';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-sb-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      
      <div className="container relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Loved by developers and teams
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
            Join thousands of developers and teams using OstrichDB to build their applications.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-sb-dark-accent rounded-lg p-6 shadow-lg border border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              <Quote size={24} className="text-sb-purple mb-4 opacity-50" />
              <p style={{ color: 'var(--text-primary)' }} className="mb-6">"{testimonial.quote}"</p>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={testimonial.logoUrl} 
                      alt={testimonial.company} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>{testimonial.author}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-xl font-medium mb-6" style={{ color: 'var(--text-primary)' }}>Trusted by teams from around the world</h3>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-8 flex items-center">
                <div className="bg-gray-400 h-6 w-24 rounded-md animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;