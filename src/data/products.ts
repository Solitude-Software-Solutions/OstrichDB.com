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
 *    Contains product data for the features section.
 * =================================================
 **/

import { Product } from "../types";

export const products: Product[] = [
  {
    id: "hierarchical",
    name: "🏗️ Hierarchical by Design",
    description: "Projects → Collections → Clusters → Records. Organize data the way you think about it. No more flat chaos or rigid tables.",
    icon: "TreePine",
  },
  {
    id: "typed",
    name: "🎯 Strongly Typed Records", 
    description: "Every Record has a guaranteed type: STRING, INTEGER, BOOLEAN, arrays of any type. Zero runtime surprises.",
    icon: "Target",
  },
  {
    id: "secure",
    name: "🔒 Secure by Default",
    description: "Built-in AES-256 encryption per Collection. User-controlled keys. No enterprise upsells required.",
    icon: "Shield",
  },
  {
    id: "performance",
    name: "⚡ Native Performance",
    description: "Written in Odin, compiled to native code. No VM overhead, no JavaScript bottlenecks. Just fast.",
    icon: "Zap",
  }
];