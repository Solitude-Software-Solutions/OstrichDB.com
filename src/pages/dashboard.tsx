
/**
 * =================================================
 * Author: Feda Elvis
 * GitHub: @FedaElvis
 *           
 * Contributors:
 *           @SchoolyB
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * File Description:
 *    The main dashboard page. Renders the following components:
 *    - ProjectsComponent: Displays the user's projects.
 *    - CollectionsComponent: Displays the user's collections within projects.
 *    - ClusterEditorComponent: Allows users to edit clusters
 *    - ManualQueryEditorComponent: Provides a manual query editor for advanced users.
 *    - NaturalLanguageQueryComponent: Allows users to query their data using natural language.
 * =================================================
 **/

import React from 'react';
import ProjectsComponent from '../components/dashboard/ProjectsComponent';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';


const Dashboard: React.FC = () => {
  return (
    <>
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <main className='flex-1'>
      <Navbar />
      <ProjectsComponent/>
      
      </main>
      <Footer />  
      </div>
    </>
  );
};

export default Dashboard;
