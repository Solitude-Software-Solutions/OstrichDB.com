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
    description: "Postgres database with powerful features like realtime subscriptions, Row Level Security, and easy scalability.",
    icon: "Database"
  },
  {
    id: "auth",
    name: "Authentication",
    description: "User management with multiple auth methods like OAuth, magic links, and phone auth.",
    icon: "KeyRound"
  },
  {
    id: "storage",
    name: "Storage",
    description: "Store, organize, and serve large files. Integrates with Postgres and comes with a CDN.",
    icon: "HardDrive"
  },
  {
    id: "functions",
    name: "Edge Functions",
    description: "Server-side TypeScript functions, deployed globally for maximum performance.",
    icon: "Zap"
  },
  {
    id: "realtime",
    name: "Realtime",
    description: "Build collaborative features and multiplayer experiences with WebSockets.",
    icon: "Activity"
  },
  {
    id: "vectorai",
    name: "Vector & AI",
    description: "Build AI applications with vector embeddings, semantic search, and more.",
    icon: "BrainCircuit"
  }
];