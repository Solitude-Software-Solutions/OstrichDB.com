/**
 * =================================================
 * Author: Marshall A Burns
 * GitHub: @SchoolyB
 * Contributors:
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * File Description:
 *    Dynamic sidebar nav component that changes based on dashboard state
 * =================================================
 **/

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import {
  IconHome2,
  IconUser,
  IconBook,
  IconUsers,
  IconLogout,
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
  
  // Determine current dashboard state based on URL
  const getDashboardState = () => {
    const path = location.pathname;
    if (path.includes('/collections')) {
      return 'collections';
    }
    return 'projects';
  };

  // Get current project name from URL if in collections view
  const getCurrentProjectName = () => {
    const path = location.pathname;
    const match = path.match(/\/projects\/([^\/]+)\/collections/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const [active, setActive] = useState(0);
  const dashboardState = getDashboardState();
  const currentProject = getCurrentProjectName();

  // Update active state when location changes
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActive(0);
    } else if (dashboardState === 'projects') {
      // In projects view, check specific routes
      if (path.includes('/account')) {
        setActive(1);
      } else if (path.includes('/documentation')) {
        setActive(2);
      } else {
        setActive(0); // Default to Home for projects view
      }
    } else if (dashboardState === 'collections') {
      // In collections view, check specific routes
      if (path.includes('/account')) {
        setActive(0); // Home is index 0 in collections view
      } else if (path.includes('/collaborators')) {
        setActive(2); // Collaborators
      } else if (path.includes('/documentation')) {
        setActive(3); // Documentation
      } else {
        setActive(0); // Default to Home for collections view
      }
    }
  }, [location.pathname, dashboardState]);

  // Navigation data for Projects view
  const projectsNavigation = [
    { 
      icon: IconHome2, 
      label: 'Home',
      onClick: () => {
        navigate('/');
        setActive(0);
      }
    },
  ];

  // Navigation data for Collections view
  const collectionsNavigation = [
    { 
      icon: IconHome2, 
      label: 'Home',
      onClick: () => {
        navigate('/');
        setActive(0);
      }
    },
    { 
      icon: IconHome2, // Placeholder icon, will use custom element
      label: `Project Status - ${currentProject}`,
      onClick: () => {
        // Maybe show project details or status
        console.log('Show project status');
        setActive(1);
      },
      customElement: <ProjectStatusIndicator />
    },
    { 
      icon: IconUsers, 
      label: 'Collaborators',
      onClick: () => {
        // Navigate to collaborators (not implemented yet)
        console.log('Navigate to collaborators');
        setActive(2);
      }
    },
  ];

  // Choose navigation based on current state
  const currentNavigation = dashboardState === 'collections' ? collectionsNavigation : projectsNavigation;

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