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
 *    Contains the CTA (Call to Action) component for user conversion.
 * =================================================
 **/

import React from "react";
import Features from "./Features";

const CTA: React.FC = () => {
  return (
    <section className="py-24 bg-sb-dark relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sb-amber/50 to-transparent"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-sb-cream/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-sb-amber/10 rounded-full blur-3xl"></div>

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Features />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
