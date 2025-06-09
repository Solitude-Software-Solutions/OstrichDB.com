/**
 * =================================================
 * Author: Kasi Reeves
 * GitHub: @Kasirocswell
 * Contributors:
 *           @SchoolyB
 *           @GaleSSalazar
 *           @FedaElvis
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * File Description:
 *    Main application component that assembles the page layout.
 * =================================================
 **/

import React, { useEffect, useState } from "react";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/home/Hero";
import CTA from "./components/home/CTA";
import Features from "./components/home/Features";
import CodeShowcase from "./components/home/InteractiveShowcase";
import CodeComparison from "./components/home/ProblemSolution";
import Dashboard from "./pages/dashboard";
import NotFound from './components/NotFound';
import { ThemeProvider } from "./context/ThemeContext";

// Kinde authentication .env variables
const clientId = import.meta.env.VITE_KINDE_CLIENT_ID;
const domain = import.meta.env.VITE_KINDE_DOMAIN;
const logoutUri = import.meta.env.VITE_KINDE_LOGOUT_URL;
const redirectUri = import.meta.env.VITE_KINDE_REDIRECT_URL;

// Mantine theme configuration
const theme = createTheme({
  colors: {
    sbPurple: [
      "#f3e8ff",
      "#e9d5ff",
      "#d8b4fe",
      "#c084fc",
      "#a855f7",
      "#9333ea",
      "#7e22ce",
      "#6b21a8",
      "#581c87",
      "#4c1d95"
    ],
  },
  primaryColor: "sbPurple",
  fontFamily: "Inter, sans-serif",
  headings: { fontFamily: "Inter, sans-serif" },
  defaultRadius: "md",
  components: {
    Button: {
      defaultProps: {
        variant: "filled",
      },
    },
  },
});

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
    <KindeProvider
      clientId={clientId}
      domain={domain}
      redirectUri={redirectUri}
      logoutUri={logoutUri}
      
    >
      <MantineProvider theme={theme}>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/"
                element={
                  <div
                    className="min-h-screen flex flex-col"
                    style={{ backgroundColor: "var(--bg-primary)" }}
                  >
                    <Navbar />
                    <main className="flex-1">
                      <Hero />
                      <CodeComparison />
                      <CodeShowcase />
                      <Features />
                      <CTA />
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </MantineProvider>
    </KindeProvider>
  );
}

export default App;