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
 *    Contains product data for the features section.
 * =================================================
 **/

import { Product } from "../types";

export const products: Product[] = [
  {
    id: "database",
    name: "Database",
    description:
      "Postgres database with powerful features like realtime subscriptions, Row Level Security, and easy scalability.",
    icon: "Database",
  },
  {
    id: "auth",
    name: "Authentication",
    description:
      "User management with multiple auth methods like OAuth, magic links, and phone auth.",
    icon: "KeyRound",
  },

  {
    id: "vectorai",
    name: "Vector & AI",
    description:
      "Build AI applications with vector embeddings, semantic search, and more.",
    icon: "BrainCircuit",
  },
];
