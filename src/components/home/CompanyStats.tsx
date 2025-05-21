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
*    Contains the CompanyStats component for displaying key metrics.
* =================================================
**/

import React from 'react';
import { Star, Users, Database, Code } from 'lucide-react';

const CompanyStats: React.FC = () => {
  const stats = [
    {
      icon: Star,
      value: '50k+',
      label: 'GitHub Stars',
    },
    {
      icon: Users,
      value: '150k+',
      label: 'Active Projects',
    },
    {
      icon: Database,
      value: '2B+',
      label: 'Edge Function Invocations',
    },
    {
      icon: Code,
      value: '500+',
      label: 'Contributors',
    },
  ];

  return (
    <section className="py-20 border-y" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <stat.icon size={24} className="text-sb-amber" />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyStats;