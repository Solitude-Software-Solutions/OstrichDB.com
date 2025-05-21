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
*    Contains navigation link data for the site's navbar.
* =================================================
**/

import { NavLink } from "../types";

export const navLinks: NavLink[] = [
  {
    label: "Product",
    href: "#",
    isDropdown: true,
    dropdownItems: [
      {
        label: "Database",
        href: "#database",
        description: "Postgres database with realtime capabilities"
      },
      {
        label: "Auth",
        href: "#auth",
        description: "User management and authentication"
      },
      {
        label: "Storage",
        href: "#storage",
        description: "Store and serve large files"
      },
      {
        label: "Edge Functions",
        href: "#functions",
        description: "Server-side code at the edge"
      },
      {
        label: "Realtime",
        href: "#realtime",
        description: "Build multiplayer experiences"
      }
    ]
  },
  {
    label: "Developers",
    href: "#",
    isDropdown: true,
    dropdownItems: [
      {
        label: "Documentation",
        href: "#docs",
        description: "Guides and references"
      },
      {
        label: "API",
        href: "#api",
        description: "API references and examples"
      },
      {
        label: "Resources",
        href: "#resources",
        description: "Tools and SDKs"
      },
    ]
  },
  {
    label: "Pricing",
    href: "#pricing"
  },
  {
    label: "Blog",
    href: "#blog"
  },
  {
    label: "Careers",
    href: "#careers"
  }
];