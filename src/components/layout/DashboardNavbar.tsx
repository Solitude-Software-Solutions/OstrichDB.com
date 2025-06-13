/**
 * =================================================
 * Author: Marshall A Burns
 * GitHub: @SchoolyB
 * Contributors:
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * File Description:
 *    Dynamic sidebar nav component with collection management tools
 * =================================================
 **/

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import {
  IconHome2,
  IconUser,
  IconBook,
  IconUsers,
  IconLogout,
  IconBraces,
  IconCode,
  IconMessage,
} from '@tabler/icons-react';
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import classes from './DashboardNavbar.module.css';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
  customElement?: React.ReactNode;
}

function NavbarLink({ icon: Icon, label, active, onClick, customElement }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        {customElement || <Icon size={20} stroke={1.5} />}
      </UnstyledButton>
    </Tooltip>
  );
}

// Custom Project Status Component
function ProjectStatusIndicator() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-5 h-5 bg-gray-600 rounded border-2 border-gray-400"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-800"></div>
      </div>
    </div>
  );
}

export function DashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useKindeAuth();
  
  // Get URL parameters for collection management
  const { projectName, collectionName } = useParams<{
    projectName: string;
    collectionName: string;
  }>();

  // Determine current dashboard state based on URL
  const getDashboardState = () => {
    const path = location.pathname;
    
    // Check if we're in collection management (any of the 4 views)
    if (path.includes('/collections/') && collectionName) {
      return 'collection-management';
    }
    
    if (path.includes('/collections')) {
      return 'collections';
    }
    
    return 'projects';
  };

  // Get current collection management tool
  const getCurrentCollectionTool = () => {
    const path = location.pathname;
    if (path.endsWith('/cluster-editor')) return 'cluster-editor';
    if (path.endsWith('/manual-query')) return 'manual-query';
    if (path.endsWith('/nlq')) return 'nlq';
    return 'overview'; // Default to overview
  };

  const [active, setActive] = useState(0);
  const dashboardState = getDashboardState();
  const currentTool = getCurrentCollectionTool();

  // Update active state when location changes
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/') {
      setActive(0);
    } else if (dashboardState === 'projects') {
      // In projects view
      if (path.includes('/account')) {
        setActive(1);
      } else if (path.includes('/documentation')) {
        setActive(2);
      } else {
        setActive(0); // Default to Home
      }
    } else if (dashboardState === 'collections') {
      // In collections list view
      if (path.includes('/account')) {
        setActive(0);
      } else if (path.includes('/collaborators')) {
        setActive(2);
      } else if (path.includes('/documentation')) {
        setActive(3);
      } else {
        setActive(0); // Default to Home
      }
    } else if (dashboardState === 'collection-management') {
      // In collection management views
      if (path.includes('/account')) {
        setActive(0);
      } else if (path.includes('/collaborators')) {
        setActive(2);
      } else if (path.includes('/documentation')) {
        setActive(6); // Adjusted for collection management tools
      } else if (currentTool === 'cluster-editor') {
        setActive(3);
      } else if (currentTool === 'manual-query') {
        setActive(4);
      } else if (currentTool === 'nlq') {
        setActive(5);
      } else {
        setActive(0); // Default to Home
      }
    }
  }, [location.pathname, dashboardState, currentTool]);

  // Navigation for different dashboard states
  const getNavigation = () => {
    const baseNavigation = [
      { 
        icon: IconHome2, 
        label: 'Home',
        onClick: () => {
          navigate('/');
          setActive(0);
        }
      }
    ];

    if (dashboardState === 'collection-management') {
      // Collection management view - show project status + collection tools
      return [
        ...baseNavigation,
        { 
          icon: IconHome2, // Will use custom element
          label: `Project Status - ${projectName}`,
          onClick: () => {
            console.log('Show project status');
            setActive(1);
          },
          customElement: <ProjectStatusIndicator />
        },
        { 
          icon: IconUsers, 
          label: 'Collaborators',
          onClick: () => {
            console.log('Navigate to collaborators');
            setActive(2);
          }
        },
        // Collection Management Tools Section
        { 
          icon: IconBraces, 
          label: 'Cluster Editor',
          onClick: () => {
            navigate(`/dashboard/projects/${encodeURIComponent(projectName!)}/collections/${encodeURIComponent(collectionName!)}/cluster-editor`);
            setActive(3);
          }
        },
        { 
          icon: IconCode, 
          label: 'Manual Query Editor',
          onClick: () => {
            navigate(`/dashboard/projects/${encodeURIComponent(projectName!)}/collections/${encodeURIComponent(collectionName!)}/manual-query`);
            setActive(4);
          }
        },
        { 
          icon: IconMessage, 
          label: 'Natural Language Query',
          onClick: () => {
            navigate(`/dashboard/projects/${encodeURIComponent(projectName!)}/collections/${encodeURIComponent(collectionName!)}/nlq`);
            setActive(5);
          }
        }
      ];
    } else if (dashboardState === 'collections') {
      // Collections list view
      return [
        ...baseNavigation,
        { 
          icon: IconHome2,
          label: `Project Status - ${projectName}`,
          onClick: () => {
            console.log('Show project status');
            setActive(1);
          },
          customElement: <ProjectStatusIndicator />
        },
        { 
          icon: IconUsers, 
          label: 'Collaborators',
          onClick: () => {
            console.log('Navigate to collaborators');
            setActive(2);
          }
        }
      ];
    } else {
      return baseNavigation;
    }
  };

  const currentNavigation = getNavigation();
  const links = currentNavigation.map((link, index) => (
    <NavbarLink
      {...link}
      key={`${dashboardState}-${link.label}-${index}`}
      active={index === active}
    />
  ));

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={classes.navbar}>
      <Center>
        {/* OstrichDB logo */}
        <div className="flex items-center justify-center w-8 h-8">
          <span className="font-bold text-lg">
            <span style={{ color: 'var(--logo-primary)' }}>O</span>
            <span style={{ color: 'var(--logo-secondary)' }}>DB</span>
          </span>
        </div>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
          
          {/* Visual separator for collection management tools */}
          {dashboardState === 'collection-management' && links.length > 3 && (
            <div className="my-2">
              <div 
                className="w-8 h-px mx-auto"
                style={{ backgroundColor: 'var(--border-color)' }}
              ></div>
            </div>
          )}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink 
          icon={IconBook} 
          label="Documentation" 
          onClick={() => {
            navigate('/documentation');
          }}
        />
        <NavbarLink
          icon={IconUser}
          label="Account"
          onClick={() => {
            navigate('/account');
          }}
        />
        <NavbarLink 
          icon={IconLogout} 
          label="Logout" 
          onClick={handleLogout}
        />
      </Stack>
    </nav>
  );
}

export default DashboardNavbar;