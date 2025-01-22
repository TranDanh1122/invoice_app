import './App.css'
import React from "react"
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import StaticSidebar from './components/app/StaticSidebar'
import InvoiceForm from './components/app/InvoiceForm'

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
    <SidebarProvider>
      <SidebarInset>
        <main className='container mb:max-w-none'>
          <div ref={containerView.current.ref} className='flex '>
            <StaticSidebar />
            <Sidebar variant='inset' collapsible='offcanvas' className={`p-0 left-[calc(${containerView.current.left}+6.5rem]`} style={{
              "--sidebar-width": "45%",
            }} side='left'>
              <SidebarContent className='px-14 py-8'>
                <InvoiceForm />
              </SidebarContent>
            </Sidebar>
            <SidebarTrigger />
          </div>

        </main>
      </SidebarInset>
    </SidebarProvider >
  )
}

export default App
