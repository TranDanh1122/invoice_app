import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './context/ThemeContent.tsx'
import AppProvider from './context/AppContext.tsx'
import { HashRouter } from "react-router"
import { SidebarProvider } from './components/ui/sidebar.tsx'
import WidthContextProvider from './context/WidthContext.tsx'

createRoot(document.getElementById('root')!).render(
  /*
   - link có dạng base/#/abc
   - chỉ gửi có servse phần base
   - client sẽ xử lí phần sau dấu # 
  */
  <HashRouter>
    <WidthContextProvider>
      <AppProvider>
        <ThemeProvider>
          <SidebarProvider defaultOpen={false} >
            <App />
          </SidebarProvider >
        </ThemeProvider>
      </AppProvider>
    </WidthContextProvider>

  </HashRouter>

)
