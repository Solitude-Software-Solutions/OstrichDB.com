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
 *    Contains the Features component for showcasing product capabilities.
 * =================================================
 **/

import React from "react";
import { products } from "../../data/products";
import * as LucideIcons from "lucide-react";

type IconProps = React.ComponentProps<typeof LucideIcons.Activity>;
type IconsType = Record<string, React.FC<IconProps>>;

const Features: React.FC = () => {
  // This is a type cast to access Lucide icons dynamically
  const Icons = LucideIcons as unknown as IconsType;

  return (
    <section className="py-20" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Start building with <span className="gradient-text">OstrichDB</span>{" "}
            today
          </h2>

          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            A complete platform for builidng and scaling your product. All the
            tools you need, fully integreated with PostgreSQL.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {products.map((product) => {
            const Icon = Icons[product.icon] || Icons.Box;

            return (
              <div
                key={product.id}
                className="bg-gradient-to-br p-px rounded-lg group"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, var(--bg-secondary), var(--bg-primary))`,
                }}
              >
                <div
                  className="rounded-lg p-6 h-full hover:bg-opacity-80 transition-all duration-300"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div
                    className="mb-4 p-3 inline-block rounded-lg"
                    style={{ backgroundColor: "var(--bg-primary)" }}
                  >
                    <Icon
                      size={24}
                      className="text-sb-amber group-hover:text-sb-amber-light transition-colors"
                    />
                  </div>
                  <h3
                    className="text-xl font-medium mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {product.name}
                  </h3>
                  <p style={{ color: "var(--text-secondary)" }}>
                    {product.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
