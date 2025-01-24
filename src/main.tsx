import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './context/ThemeContent.tsx'
import AppProvider from './context/AppContext.tsx'
import { BrowserRouter } from "react-router"
import { SidebarProvider } from './components/ui/sidebar.tsx'

createRoot(document.getElementById('root')!).render(

  <BrowserRouter>
    <SidebarProvider defaultOpen={false} >
      <AppProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AppProvider>
    </SidebarProvider >

  </BrowserRouter>

)
