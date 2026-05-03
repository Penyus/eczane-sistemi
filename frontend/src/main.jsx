import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './hekim.css'
import './hekim-saas.css'
import './i18n.jsx'
import './mock-data.jsx'
import './icons.jsx'
import './tweaks-panel.jsx'
import './login.jsx'
import './app-screens.jsx'
import './app-screens-saas.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)