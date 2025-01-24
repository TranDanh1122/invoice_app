import React from "react";
import { Sidebar, SidebarFooter, SidebarHeader } from '../ui/sidebar'
import logo from "../../assets/logo.svg"
import moon from "../../assets/icon-moon.svg"
import sun from "../../assets/icon-sun.svg"
import avt from "../../assets/image-avatar.jpg"
import { ThemeContext } from "@/context/ThemeContent";
import {WidthContext} from "@/context/WidthContext";
function StaticSidebar(): React.JSX.Element {
    const { theme, setTheme } = React.useContext(ThemeContext)
    const { width } = React.useContext(WidthContext)
    if (width <= 1023)
        return <>
            <div className='rounded-tr-3xl rounded-br-3xl tb:rounded-none bg-[var(--four)] 
            fixed z-20 top-0 left-0 w-screen h-20 flex items-center justify-between' >
                <div className='p-0 bg-[var(--one)]  h-[5rem] w-[5rem] flex items-center justify-center rounded-tr-3xl rounded-br-3xl'>
                    <img src={logo} alt="logo" className='w-8 h-7 object-cover' />
                </div>
                <div className='p-0 flex justify-end gap-6 items-center w-1/2'>
                    <i onClick={() => setTheme(theme == "dark" ? "light" : "dark")} className='block w-5 h-5 bg-[var(--seven)] ' style={{
                        mask: `url("${theme === "light" ? moon : sun}") center / cover no-repeat`,
                        WebkitMask: `url("${theme === "light" ? moon : sun}") center / cover no-repeat`,
                    }}></i>
                    <div className='w-max p-6 border-solid border-l-[1px] border-l-[var(--seven)]'>
                        <img src={avt} alt="avatar" className='w-8 h-8 rounded-full' />
                    </div>

                </div>
            </div>
        </>
    return (<>
        <Sidebar side="left" variant="inset" collapsible="none" className='rounded-tr-3xl rounded-br-3xl h-full min-h-screen bg-[var(--four)]' style={{
            "--sidebar-width": "6.5rem",
            "--sidebar-width-mobile": "5rem",
        } as React.CSSProperties}>
            <SidebarHeader className='p-0 bg-[var(--one)]  h-[6.5rem] w-full flex items-center justify-center rounded-tr-3xl rounded-br-3xl'>
                <img src={logo} alt="logo" className='w-12 h-11 object-cover' />
            </SidebarHeader>
            <SidebarFooter className='mt-auto p-0 flex flex-col items-center'>
                <i onClick={() => setTheme(theme == "dark" ? "light" : "dark")} className='block w-5 h-5 bg-[var(--seven)] mb-8' style={{
                    mask: `url("${theme === "light" ? moon : sun}") center / cover no-repeat`,
                    WebkitMask: `url("${theme === "light" ? moon : sun}") center / cover no-repeat`,
                }}></i>
                <div className='w-full px-8 py-6 border-solid border-t-[1px] border-t-[var(--seven)]'>
                    <img src={avt} alt="avatar" className='w-10 h-10 rounded-full' />
                </div>

            </SidebarFooter>
        </Sidebar>
    </>)
}
export default React.memo(StaticSidebar)