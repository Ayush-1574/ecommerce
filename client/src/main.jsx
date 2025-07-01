import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {Toaster } from "./components/ui/sonner"

import App from './App.jsx';
import store from './store/store';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
      <Provider store={store}>
        <App />
        <Toaster/>
      </Provider>
    
  </StrictMode>
);
