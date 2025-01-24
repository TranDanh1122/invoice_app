import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './context/ThemeContent.tsx'
import AppProvider from './context/AppContext.tsx'
import { BrowserRouter } from "react-router"

createRoot(document.getElementById('root')!).render(
 
    <BrowserRouter>
        <AppProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AppProvider>
    </BrowserRouter>

)
