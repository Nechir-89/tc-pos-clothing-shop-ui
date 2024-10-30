import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router'

import './index.css'
import { NextUIProvider } from "@nextui-org/react";
import UserProvider from './contexts/UserContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <UserProvider>
        <Router />
      </UserProvider>
    </NextUIProvider>
  </React.StrictMode>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
