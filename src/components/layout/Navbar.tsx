/**
 * =================================================
 * Author: Kasi Reeves
 * GitHub: @Kasirocswell
 * Contributors:
 *           @SchoolyB
 *           @GaleSSalazar
 *           @FedaElvis
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * File Description:
 *    Contains the Navbar component with responsive navigation and dropdowns.
 * =================================================
 **/

import React, { useState, useEffect } from "react";
import { ChevronDown, Menu, X, Github, ExternalLink, ArrowUp } from "lucide-react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import AuthButtons from "../common/AuthButtons";
import ProfileDropdown from "../common/UserProfileDropdown"; // Add this import
import { navLinks } from "../../data/navLinks";
import { NavLink } from "../../types";
import ThemeToggle from "../common/ThemeToggle";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Add Kinde auth hook
  const { isAuthenticated, isLoading } = useKindeAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
      
      // Show scroll to top button after scrolling 300px
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const renderDropdown = (link: NavLink) => {
    if (!link.isDropdown) return null;

    return (
      <div
        className={`absolute top-full left-0 w-64 bg-sb-dark-accent dark:bg-sb-dark-accent light:bg-sb-cream rounded-md shadow-lg p-4 transform origin-top-left transition-all duration-200 ${
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
              className="block px-3 py-2 text-sm hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-200 rounded-md transition-colors"
            >
              <div className="font-medium">{item.label}</div>
              {item.description && (
                <div className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-xs mt-1">
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
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 text-sb-cream dark:text-sb-light ${
          isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ color: 'var(--text-primary)' }}
      >
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              <span className="text-[var(--logo-primary)]">Ostrich</span>
              <span className="text-[var(--logo-secondary)]">DB</span>
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
                <button 
                  className="flex items-center space-x-1 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
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
              href="https://github.com/Archetype-Dynamics/OstrichDB.com"
              target="_blank"
              className="text-sb-gray hover:text-white transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Github size={20} />
            </a>
            
            {/* Conditional rendering based on authentication */}
            {!isLoading && (
              isAuthenticated ? <ProfileDropdown /> : <AuthButtons />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            {!isLoading && isAuthenticated && <ProfileDropdown />}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: 'var(--text-primary)' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute w-full transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-[80vh] opacity-100"
            : "max-h-0 opacity-0 invisible"
        } overflow-hidden`}
        style={{ backgroundColor: 'var(--bg-secondary)' }}
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
                style={{ color: 'var(--text-primary)' }}
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
                      className="block py-2 text-sm hover:opacity-80"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Mobile Auth Section */}
          {!isLoading && !isAuthenticated && (
            <div className="pt-4 border-t border-gray-600">
              <AuthButtons />
            </div>
          )}
        </div>
      </div>
    </nav>

    {/* Scroll to Top Button */}
    <button
      onClick={scrollToTop}
      className={`fixed right-6 bottom-6 z-50 w-12 h-12 rounded-full bg-sb-amber hover:bg-sb-amber-dark shadow-lg transition-all duration-300 flex items-center justify-center ${
        showScrollToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{
        color: 'var(--text-primary)'
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  </>
  );
};

export default Navbar;