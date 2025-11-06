import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Snow from './components/Snow.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Snowfall overlay applied on all pages */}
    <Snow />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <App />
    </div>
  </StrictMode>,
)
