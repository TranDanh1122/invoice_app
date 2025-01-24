import { AppContext } from '@/context/AppContext'
import { ThemeContext } from '@/context/ThemeContent'
import clsx from 'clsx'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import iconDown from "../assets/icon-arrow-down.svg"
import iconPlus from "../assets/icon-plus.svg"
import { v4 } from "uuid"
import { NavLink } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import iconRight from "../assets/icon-arrow-right.svg"
import { useSidebar } from '../components/ui/sidebar'
import Empty from '@/components/app/Empty'
export default function List(): React.JSX.Element {

    const { state, dispatch } = React.useContext(AppContext)
    const { theme } = React.useContext(ThemeContext)
    const { toggleSidebar } = useSidebar()
    console.log("re-render", state.filteredData);

    React.useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await fetch("/data.json")
                const data = await response.json()
                localStorage.setItem("data", JSON.stringify(data))
                console.log(data);

                dispatch({ type: "INIT", payload: data })
            }
            fetchData()
        } catch (error) {
            console.log(error);
        }
    }, [])
    const header = React.useRef({
        el: React.createRef<HTMLDivElement>(),
        height: 0
    })
    const list = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
        if (header.current && header.current.el.current) {
            const height = header.current.el.current.getBoundingClientRect().height
            header.current.height = height
        }
    }, [])
    React.useEffect(() => {
        if (list.current && header.current) {
            const height = list.current.getBoundingClientRect().height
            const headerSpacingHeight = header.current.height + 64 + 80
            const viewportHeight = window.innerHeight
            const listMaxHeight = viewportHeight - headerSpacingHeight
            list.current.style.maxHeight = `${listMaxHeight}px`
            if ((height + headerSpacingHeight) > document.documentElement.clientHeight) {
                list.current.classList.remove("scrollbar-none")
                list.current.classList.add("scrollbar-thin")
            } else {
                list.current.classList.add("scrollbar-none")
                list.current.classList.remove("scrollbar-thin")
            }
        }
    }, [state.filteredData])

    return (
        <>
            <div className='w-2/3 mx-auto overflow-hidden mt-20'>
                <div ref={header.current.el} className='flex items-center justify-start gap-10'>
                    <div className='mr-auto'>
                        <h1 className={clsx('heading_l', {
                            "text-[#0C0E16]": theme == "light",
                            "text-white": theme == "dark"
                        })}>Invoices</h1>
                        <span className={clsx('body', {
                            "text-[var(--six)]": theme == "light",
                            "text-white": theme == "dark"
                        })}>
                            {state.filteredData.length > 0 && `There are ${state.filteredData.length} ${state.filter ? state.filter : "total"}  invoices`}
                            {state.filteredData.length <= 0 && "No invoice"}
                        </span>
                    </div>
                    <Filter />
                    <Button onClick={() => {
                        dispatch({ type: "EDIT", payload: "" })
                        toggleSidebar()
                    }} className='rounded-3xl py-2 bg-[var(--one)] hover:bg-[var(--two)]' style={{ height: "auto" }}>
                        <span className='w-8 h-8 rounded-full bg-white flex items-center justify-center'>
                            <i className='w-[10px] h-[10px] block bg-[var(--one)]' style={{
                                mask: `url("${iconPlus}") center/cover no-repeat`,
                                WebkitMask: `url("${iconPlus}") center/cover no-repeat`

                            }}></i>
                        </span> New Invoice</Button>
                </div>
                {state.filteredData.length > 0 &&
                    <div ref={list} className='h-fit overflow-y-scroll scrollbar-none mt-16 flex flex-col gap-4' >
                        {
                            state.filteredData.map(el => <InvoiceItem key={v4()} invoice={el} />)
                        }
                    </div>
                }
                {state.filteredData.length <= 0 &&
                    <Empty />

                }
            </div >
        </>
    )

}
const status = [
    "Pending", "Paid", "Draft"
]
export const InvoiceItem = React.memo(({ invoice }: { invoice: Invoice }): React.JSX.Element => {
    const date = React.useMemo(() => {
        const dateObj = new Date(invoice.date);
        return dateObj.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }, [invoice.date])
    const { theme } = React.useContext(ThemeContext)
    return (
        <NavLink to={`/detail/${invoice.id}`} className={clsx('py-4 px-8 flex items-center justify-start cursor-pointer w-full shadow-sm rounded-sm', {
            "bg-white text-[var(--seven)]": theme == "light",
            "bg-[var(--three)] text-white": theme == "dark",
        })}>
            <h2 className='uppercase heading_s w-1/12'><span>#</span>{invoice.id}</h2>
            <span className='body  w-2/12 ml-auto'>{`Due ${date}`}</span>
            <span className='body w-2/12'>{invoice.to_name}</span>
            <span className={clsx('heading_s text-[#0C0E16]  w-3/12 ml-auto text-right', {
                " text-[#0C0E16]": theme == "light",
                " text-white": theme == "dark",
            })}>${invoice.total}</span>
            <Badge className={clsx('py-3 rounded-md heading-s w-3/12 flex items-center justify-center gap-2 max-w-28 ml-auto', {
                "bg-[#33D69F]/15 hover:bg-[#33D69F]/10 text-[#33D69F]": invoice.status == "Paid",
                "bg-[#FF8F00]/15 hover:bg-[#FF8F00]/10 text-[#FF8F00]": invoice.status == "Pending",
                "bg-[#373B53]/15 hover:bg-[#373B53]/10": invoice.status == "Draft",
                "text-[#373B53]": invoice.status == "Draft" && theme == "light",
                "text-white": invoice.status == "Draft" && theme == "dark"

            })} > <span className={clsx('w-2 h-2 rounded-full', {
                "bg-[#33D69F]": invoice.status == "Paid",
                "bg-[#FF8F00]": invoice.status == "Pending",
                "bg-[#373B53]": invoice.status == "Draft" && theme == "light",
                "bg-white": invoice.status == "Draft" && theme == "dark"
            })}></span> {invoice.status}</Badge>
            <i className='max-w-1 h-2 block bg-[var(--one)] w-1/12 ml-auto' style={{
                mask: `url("${iconRight}") center / cover no-repeat`,
                WebkitMask: `url("${iconRight}") center / cover no-repeat`
            }}></i>
        </NavLink>
    )
})
export function Filter(): React.JSX.Element {
    const [open, setOpen] = React.useState(false)
    const { state, dispatch } = React.useContext(AppContext)
    const { theme } = React.useContext(ThemeContext)
    return (
        <div className="flex items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="link"
                        size="sm"
                        className={clsx("w-fit justify-start hover:no-underline", {
                            "text-[var(--eleven)]": theme == "dark",
                            "text-[var(--twelve)]": theme == "light",
                        })}>
                        {state.filter ? state.filter : "Filter by Status"}
                        <i className={clsx('block w-2 h-1 bg-[var(--one)]', {
                            "rotate-0": open,
                            "rotate-180": !open
                        })}
                            style={{
                                mask: `url("${iconDown}") center/cover no-repeat`,
                                WebkitMask: `url("${iconDown}") center/cover no-repeat`
                            }}
                        >

                        </i>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {status.map((status) => (
                                    <CommandItem key={status} value={status} className='px-4 w-full cursor-pointer'
                                        onSelect={(value) => {
                                            dispatch({ type: "FILTER", payload: value })
                                            setOpen(false)
                                        }} >
                                        <Checkbox id={status} className='data-[state=checked]:bg-[var(--one)]
                                         bg-[var(--five)] border-none outline-none hover:border-[var(--one)] hover:border-[1px] hover:border-solid ' checked={state.filter == status} />
                                        <span>{status}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}