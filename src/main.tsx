/**
* =================================================
* #Author: Kasi Reeves
* GitHub: @Kasirocswell  
* #Contributors: 
*           
* 
* License: Apache License 2.0 (see LICENSE file for details)
* Copyright (c) 2025-Present Archetype Dynamics, Inc.
* #File Description:
*    Application entry point that renders the React root component.
* =================================================
**/

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
