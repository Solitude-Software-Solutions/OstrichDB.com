/**
 * =================================================
 * #Author: Kasi Reeves
 * GitHub: @Kasirocswell
 * #Contributors:
 *           @SchoolyB
 *           @GaleSSalazar
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
        description: "Postgres database with realtime capabilities",
      },
      {
        label: "Auth",
        href: "#auth",
        description: "User management and authentication",
      },
    ],
  },
  {
    label: "Developers",
    href: "#",
    isDropdown: true,
    dropdownItems: [
      {
        label: "Documentation",
        href: "#docs",
        description: "Guides and references",
      },
      {
        label: "API",
        href: "#api",
        description: "API references and examples",
      },
      {
        label: "Resources",
        href: "#resources",
        description: "Tools and SDKs",
      },
    ],
  },
];
