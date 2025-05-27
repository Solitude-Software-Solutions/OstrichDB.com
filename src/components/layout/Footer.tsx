/**
 * =================================================
 * #Author: Kasi Reeves
 * GitHub: @Kasirocswell
 * #Contributors:
 *           @SchoolyB
 *           @GaleSSalazar
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * #File Description:
 *    Contains the Footer component with site links and company information.
 * =================================================
 **/

import React from "react";
import { Github, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer
      className="border-t flex items-center justify-center min-h-32 "
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="w-full" style={{ borderColor: "var(--border-color)" }}>
        <div className=" flex flex-col md:flex-row md:justify-around items-center  flex-wrap gap-4 pt-6 ">
          <a
            href="#"
            style={{ color: "var(--text-secondary)" }}
            className="hover:text-white text-sm transition-colors"
          >
            Documentation
          </a>

          <a
            href="#"
            style={{ color: "var(--text-secondary)" }}
            className="hover:text-white text-sm transition-colors"
          >
            <Youtube></Youtube>
          </a>

          <a
            href="https://github.com/Archetype-Dynamics/OstrichDB.com"
            target="_blank"
            style={{ color: "var(--text-secondary)" }}
            className="hover:text-white text-sm transition-colors"
          >
            <Github></Github>
          </a>
          <p
            style={{ color: "var(--text-secondary)" }}
            className="text-sm mb-4 md:mb-0"
          >
            © {new Date().getFullYear()} Archetype Dynamcics, Inc. All rights
            reserved.
          </p>
          <a
            href="#"
            style={{ color: "var(--text-secondary)" }}
            className="hover:text-white text-sm transition-colors"
          >
            DPA
          </a>
          <a
            href="#"
            style={{ color: "var(--text-secondary)" }}
            className="hover:text-white text-sm transition-colors"
          >
            SLA
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
