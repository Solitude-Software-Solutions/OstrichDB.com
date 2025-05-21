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
*    Contains customer testimonial data for the testimonials section.
* =================================================
**/

import { Testimonial } from "../types";

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "OstrichDB has been instrumental in our ability to ship features quickly and efficiently. Their PostgreSQL database and authentication system has saved us months of development time.",
    author: "Sarah Johnson",
    role: "CTO",
    company: "TechStart",
    logoUrl: "https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "2",
    quote: "We migrated from MongoDB to OstrichDB and haven't looked back. The open source approach and Postgres foundation give us complete control over our data.",
    author: "Michael Chang",
    role: "Lead Developer",
    company: "DataFlow",
    logoUrl: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "3",
    quote: "OstrichDB Auth and Storage have simplified our architecture significantly. We're now able to focus on building our product rather than maintaining infrastructure.",
    author: "Emma Richards",
    role: "Product Manager",
    company: "CreativeHub",
    logoUrl: "https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];