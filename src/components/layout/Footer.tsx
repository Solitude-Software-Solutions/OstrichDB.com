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
*    Contains the Footer component with site links and company information.
* =================================================
**/

import React from 'react';
import { Github, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Database', href: '#' },
        { label: 'Auth', href: '#' },
        { label: 'Storage', href: '#' },
        { label: 'Functions', href: '#' },
        { label: 'Realtime', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
        { label: 'Guides', href: '#' },
        { label: 'Status', href: '#' },
        { label: 'Changelog', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Open Source', href: '#' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { label: 'GitHub', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Partners', href: '#' },
        { label: 'Discord', href: '#' },
        { label: 'Integrations', href: '#' },
      ],
    },
  ];

  return (
    <footer className="border-t" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="inline-block mb-4">
              <span className="font-bold text-xl">
                <span className="logo-text-primary">Ostrich</span>
                <span className="logo-text-secondary">DB</span>
              </span>
            </a>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              The All-In-One Backend Solution
            </p>
            <div className="flex space-x-4">
              <a href="#" style={{ color: 'var(--text-secondary)' }} className="hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)' }} className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)' }} className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)' }} className="hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{ color: 'var(--text-secondary)' }}
                      className="hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Archetype Dynamcics, Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" style={{ color: 'var(--text-secondary)' }} className="hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" style={{ color: 'var(--text-secondary)' }} className="hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" style={{ color: 'var(--text-secondary)' }} className="hover:text-white text-sm transition-colors">
              DPA
            </a>
            <a href="#" style={{ color: 'var(--text-secondary)' }} className="hover:text-white text-sm transition-colors">
              SLA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;