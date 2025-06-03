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
 *    Contains the Hero component for the landing page with animated code display.
 * =================================================
 **/

import { ArrowRight } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen pt-24 hero-gradient">
      <div className="container pb-20 pt-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span style={{ color: "var(--text-primary)" }} className="block">
              The Database That
            </span>
            <span className="text-sb-amber block">Gets You</span>
          </h1>
          <p
            style={{ color: "var(--text-primary)" }}
            className="text-xl md:text-2xl mb-8 leading-relaxed"
          >
            Hierarchical organization. Strong typing. Built-in security. 
            Finally, a database that works the way developers think.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#" className="btn btn-primary py-3 px-6 text-base">
              Start Building Free
            </a>
            <a href="#" className="btn btn-outline py-3 px-6 text-base group">
              <span>View Docs</span>
              <ArrowRight
                size={16}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;