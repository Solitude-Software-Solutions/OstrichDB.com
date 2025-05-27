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
 *    Main application component that assembles the page layout.
 * =================================================
 **/

import React, { useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/home/Hero";
import CTA from "./components/home/CTA";
import GetStarted from "./components/home/GetStarted";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-sb-purple/30 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <Navbar />
        <main className="flex-1">
          <Hero />
          <CTA />
          <GetStarted />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
