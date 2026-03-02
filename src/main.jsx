import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ServiceProvider } from './context/ServiceContext'
import { SettingsProvider } from './context/SettingsContext'
import { PortfolioProvider } from './context/PortfolioContext'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ServiceProvider>
        <PortfolioProvider>
          <SettingsProvider>
            <HelmetProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </HelmetProvider>
          </SettingsProvider>
        </PortfolioProvider>
      </ServiceProvider>
    </AuthProvider>
  </React.StrictMode>
)

