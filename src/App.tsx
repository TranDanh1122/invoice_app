import './App.css'
import React from "react"
import { Sidebar, SidebarContent, SidebarInset, useSidebar } from './components/ui/sidebar'
import StaticSidebar from './components/app/StaticSidebar'
import InvoiceForm from './components/app/InvoiceForm'
import { Routes, Route } from "react-router"
import List from './pages/List'
import { Detail } from './pages/Detail'
import clsx from 'clsx'
import { ThemeContext } from './context/ThemeContent'
import Form from './pages/Form'
import { Toaster } from "@/components/ui/toaster"
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
  const { open, setOpen } = useSidebar()
  const { theme } = React.useContext(ThemeContext)
  return (
    <SidebarInset>
      {open && <div onClick={() => setOpen(false)} className=' fixed w-screen h-screen top-0 left-0 z-10 bg-black/30'></div>}
      <main className={clsx('container h-screen overflow-y-hidden mb:max-w-none', {
        "bg-[var(--eleven)]": theme == "light",
        "bg-[var(--twelve)]": theme == "dark",

      })}>
        <div ref={containerView.current.ref} className='flex w-full' >
          <StaticSidebar />
          <Sidebar variant='sidebar' collapsible='offcanvas' className={`p-0 bg-white  left-[calc(${containerView.current.left}+6.5rem)] `}
            style={{
              "--sidebar-width": "45%",
            } as React.CSSProperties} side='left'>
            <SidebarContent className='px-14 py-8 bg-white scrollbar-none sidebar_content'>
              <InvoiceForm />
            </SidebarContent>
          </Sidebar>

          <Routes>
            <Route path="/" index element={<List />}></Route>
            <Route path="/detail/:id" element={<Detail />}></Route>
            <Route path="/create" element={<Form />}></Route>
            <Route path="/edit/:id" element={<Form />}></Route>
          </Routes>
        </div>
        <Toaster />

      </main>
    </SidebarInset>
  )
}

export default App
