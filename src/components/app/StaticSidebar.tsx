import React from "react";
import { Sidebar, SidebarFooter, SidebarHeader } from '../ui/sidebar'
import logo from "../../assets/logo.svg"
import moon from "../../assets/icon-moon.svg"
import sun from "../../assets/icon-sun.svg"
import avt from "../../assets/image-avatar.jpg"
import { ThemeContext } from "@/context/ThemeContent";
function StaticSidebar(): React.JSX.Element {
    const { theme } = React.useContext(ThemeContext)
    return (<>
        <Sidebar side="left" variant="inset" collapsible="none" className='rounded-tr-3xl rounded-br-3xl h-full min-h-screen bg-[var(--four)]' style={{
            "--sidebar-width": "6.5rem",
            "--sidebar-width-mobile": "5rem",
        }}>
            <SidebarHeader className='p-0 bg-[var(--one)]  h-[6.5rem] w-full flex items-center justify-center rounded-tr-3xl rounded-br-3xl'>
                <img src={logo} alt="logo" className='w-12 h-11 object-cover' />
            </SidebarHeader>
            <SidebarFooter className='mt-auto p-0 flex flex-col items-center'>
                <i className='block w-5 h-5 bg-[var(--seven)] mb-8' style={{
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