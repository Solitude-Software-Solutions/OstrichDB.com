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
 *    Contains the CTA component with fade up + scale animation.
 * =================================================
 **/

import React from "react";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation, getAnimationClasses } from "../../utils/hooks/useScrollAnimation";

const CTA: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  return (
    <section 
      ref={elementRef}
      className="py-24 relative overflow-hidden"
    >
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
              getAnimationClasses(isVisible, 'fadeUpScale', 0)
            }`}
            style={{ color: "var(--text-primary)" }}
          >
            Ready to Build Something 
            <span className="text-sb-amber"> Amazing?</span>
          </h2>
          
          <p 
            className={`text-lg md:text-xl mb-8 leading-relaxed ${
              getAnimationClasses(isVisible, 'fadeUpScale', 100)
            }`}
            style={{ color: "var(--text-primary)" }}
          >
            Start your free project today!
          </p>
          
          <div className={`flex flex-col sm:flex-row justify-center gap-4 ${
            getAnimationClasses(isVisible, 'fadeUpScale', 200)
          }`}>
            <a href="#" className="btn btn-primary py-3 px-8 text-base">
              Get Started Now
            </a>
            <a href="#" className="btn btn-outline py-3 px-8 text-base group">
              <span>Talk to Sales</span>
              <ArrowRight
                size={16}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;