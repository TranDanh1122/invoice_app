import './App.css'
import React from "react"
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider } from './components/ui/sidebar'
import StaticSidebar from './components/app/StaticSidebar'
import InvoiceForm from './components/app/InvoiceForm'
import { Routes, Route } from "react-router"
import List from './pages/List'
import { Detail } from './pages/Detail'

function App() {
  const containerView = React.useRef({
    left: 0,
    ref: React.createRef<HTMLDivElement>()
  })
  React.useEffect(() => {
    if (!containerView.current.ref.current) return
    const left = containerView.current.ref.current.getBoundingClientRect().left
    containerView.current.left = left
  }, [])
  return (
    <SidebarProvider defaultOpen={false} >
      <SidebarInset>
        <main className='container mb:max-w-none bg-[var(--eleven)]'>
          <div ref={containerView.current.ref} className='flex w-full' >
            <StaticSidebar />
            <Sidebar variant='inset' collapsible='offcanvas' className={`p-0 bg-white left-[calc(${containerView.current.left}+6.5rem)] `} 
            style={{
              "--sidebar-width": "45%",
            } as React.CSSProperties & Record<string, any>}  side='left'>
              <SidebarContent className='px-14 py-8 bg-white scrollbar-none sidebar_content'>
                <InvoiceForm />
              </SidebarContent>
            </Sidebar>

            <Routes>
              <Route path="/" index element={<List />}></Route>
              <Route path="/detail/:id" index element={<Detail />}></Route>

            </Routes>
          </div>

        </main>
      </SidebarInset>
    </SidebarProvider >
  )
}

export default App
