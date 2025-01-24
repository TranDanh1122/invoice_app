import React from "react";
import emptyImg from "../../assets/illustration-empty.svg"
import clsx from "clsx";
import { ThemeContext } from "@/context/ThemeContent";
function Empty(): React.JSX.Element {
    const { theme } = React.useContext(ThemeContext)
    return (
        <div className=' max-w-60 w-fit mx-auto relative top-[50%] translate-y-[-50%]'>
            <img src={emptyImg} alt="empty" className='w-52 h-52 object-contain mx-auto' />
            <h2 className={clsx('heading_m text-center', {
                "text-black": theme == "light",
                "text-white": theme == "dark"
            })}>There is nothing here</h2>
            <p className='text-[var(--six)] body text-center'>  Create an invoice by clicking the  New Invoice button and get started</p>
        </div>

    )
}
export default React.memo(Empty)