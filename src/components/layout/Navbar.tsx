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
 *    Contains the Navbar component with responsive navigation and dropdowns.
 * =================================================
 **/

import React, { useState, useEffect } from "react";
import { ChevronDown, Menu, X, Github, ExternalLink } from "lucide-react";
import { navLinks } from "../../data/navLinks";
import { NavLink } from "../../types";
import ThemeToggle from "../common/ThemeToggle";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const renderDropdown = (link: NavLink) => {
    if (!link.isDropdown) return null;

    return (
      <div
        className={`absolute top-full left-0 w-64 bg-sb-dark-accent rounded-md shadow-lg p-4 transform origin-top-left transition-all duration-200 ${
          activeDropdown === link.label
            ? "animate-slide-down opacity-100"
            : "opacity-0 invisible"
        }`}
      >
        <div className="space-y-3">
          {link.dropdownItems?.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-3 py-2 text-sm hover:bg-gray-700 rounded-md transition-colors"
            >
              <div className="font-medium">{item.label}</div>
              {item.description && (
                <div className="text-gray-400 text-xs mt-1">
                  {item.description}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-sb-dark/90 backdrop-blur-sm shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              <span className="logo-text-primary">Ostrich</span>
              <span className="logo-text-secondary">DB</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                // checks if the link is a dropdown and and sets it as active, updates React state to track which dropdown is currently visible
                onMouseEnter={() =>
                  link.isDropdown && setActiveDropdown(link.label)
                }
                // hides active dropdown as soon as mouse leaves dropdown
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                  <span>{link.label}</span>
                  {link.isDropdown && <ChevronDown size={16} />}
                </button>
                {link.isDropdown && renderDropdown(link)}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <a
              href="https://github.com/Archetype-Dynamics/OstrichDB.com" target="_blank"
              className="text-sb-cream hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a href="#" className="btn btn-outline text-sm">
              Sign In
            </a>
            <a href="#" className="btn btn-primary text-sm">
              Start Free
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-sb-dark-accent absolute w-full transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-[80vh] opacity-100"
            : "max-h-0 opacity-0 invisible"
        } overflow-hidden`}
      >
        <div className="container py-4 space-y-4">
          {navLinks.map((link) => (
            <div key={link.label} className="py-2">
              <button
                onClick={() =>
                  link.isDropdown
                    ? toggleDropdown(link.label)
                    : setMobileMenuOpen(false)
                }
                className="flex items-center justify-between w-full text-left"
              >
                <span>{link.label}</span>
                {link.isDropdown && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      activeDropdown === link.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {link.isDropdown && (
                <div
                  className={`mt-2 pl-4 space-y-2 transition-all duration-200 ${
                    activeDropdown === link.label ? "block" : "hidden"
                  }`}
                >
                  {link.dropdownItems?.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block py-2 text-sm text-gray-300 hover:text-white"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-gray-700 flex flex-col space-y-3">
            <a href="#" className="btn btn-outline text-center">
              Sign In
            </a>
            <a href="#" className="btn btn-primary text-center">
              Start Free
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
