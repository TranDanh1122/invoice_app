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
import { NavLink, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import iconRight from "../assets/icon-arrow-right.svg"
import { useSidebar } from '../components/ui/sidebar'
import Empty from '@/components/app/Empty'
import { WidthContext } from '@/context/WidthContext'
function List(): React.JSX.Element {

    const { state, dispatch } = React.useContext(AppContext)
    const { theme } = React.useContext(ThemeContext)
    const { width } = React.useContext(WidthContext)
    console.log("re-render", state.filteredData);

    React.useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await fetch("/data.json")
                const data = await response.json()
                localStorage.setItem("data", JSON.stringify(data))
                dispatch({ type: "INIT", payload: data })
            }
            fetchData()
        } catch (error) {
            console.log(error);
        }
    }, [])
    const header = React.useRef<HTMLDivElement>(null)
    const list = React.useRef<HTMLDivElement>(null)
    React.useLayoutEffect(() => {
        if (list.current) list.current.style.maxHeight = "none"
    }, [state.filteredData])
    React.useEffect(() => {
        /**
         * - trước khi vẽ layout thì xóa cái maxheight đi (để list nó xổ hết xuống mới tính được height)
         * - tính height của list sau khi được render
         * - tính height header + các spacing (margin)
         * - maxheight hiện tại (không gian khả thi) = vh - header
         * - nếu height > maxheight => scrollable
         */
        if (list.current && header.current) {
            const height = list.current.getBoundingClientRect().height
            const headerSpacingHeight = header.current.getBoundingClientRect().height + 64 + 80
            const listMaxHeight = window.innerHeight - headerSpacingHeight
            list.current.style.maxHeight = `${listMaxHeight}px`
            if (height > listMaxHeight) {
                list.current.classList.add("scrollbar-thin", "overflow-y-scroll")
            } else {
                list.current.classList.remove("scrollbar-thin", "overflow-y-scroll")
            }
        }

    }, [state.filteredData])
    const handleFilter = React.useCallback((payload: string) => dispatch({ type: "FILTER", payload: payload }), [dispatch])
    return (
        <>
            <div className='w-2/3 tb:w-full tb:px-8 mb:w-full mb:px-4 mx-auto overflow-hidden mt-20 '>
                <div ref={header} className='flex items-center justify-start gap-10'>
                    <div className='mr-auto'>
                        <h1 className={clsx('heading_l mb:heading_m', {
                            "text-[#0C0E16]": theme == "light",
                            "text-white": theme == "dark"
                        })}>Invoices</h1>
                        <span className={clsx('body', {
                            "text-[var(--six)]": theme == "light",
                            "text-white": theme == "dark"
                        })}>
                            {(state.filteredData.length > 0 && width > 1023) && `There are ${state.filteredData.length} ${state.filter ? state.filter : "total"}  invoices`}
                            {(state.filteredData.length > 0 && width < 1024) && `${state.filteredData.length} ${state.filter ? state.filter : "total"}  invoices`}
                            {state.filteredData.length <= 0 && "No invoice"}
                        </span>
                    </div>
                    <Filter filter={state.filter} setFilter={handleFilter} />
                    <NewInvoiceBTN />
                </div>
                {state.filteredData.length > 0 &&
                    <div ref={list} className='h-fit mt-16 flex flex-col gap-4' >
                        {
                            state.filteredData.map(el => <InvoiceItem key={el.id} invoice={el} />)
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
export default React.memo(List)
function NewInvoiceBTN(): React.JSX.Element {
    const { toggleSidebar } = useSidebar()
    const { dispatch } = React.useContext(AppContext)
    const { width } = React.useContext(WidthContext)
    const navigate = useNavigate()
    return <>
        <Button onClick={() => {
            dispatch({ type: "EDIT", payload: "" })
            if (width < 1024) {
                navigate("/create")
            } else {
                toggleSidebar()
            }
        }} className='rounded-3xl py-2 bg-[var(--one)] hover:bg-[var(--two)]' style={{ height: "auto" }}>
            <span className='w-8 h-8 rounded-full bg-white flex items-center justify-center'>
                <i className='w-[10px] h-[10px] block bg-[var(--one)]' style={{
                    mask: `url("${iconPlus}") center/cover no-repeat`,
                    WebkitMask: `url("${iconPlus}") center/cover no-repeat`

                }}></i>
            </span> New {width > 1023 ? "Invoice" : ""} </Button>
    </>
}
const status = [
    "Pending", "Paid", "Draft"
]
const InvoiceItem = React.memo(({ invoice }: { invoice: Invoice }): React.JSX.Element => {
    console.log("render-inv item");

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
        <NavLink to={`/detail/${invoice.id}`} className={clsx(`py-4 px-8 
            flex items-center justify-start mb:flex-wrap mb:gap-y-4
            cursor-pointer w-full shadow-sm 
            rounded-sm`, {
            "bg-white text-[var(--seven)]": theme == "light",
            "bg-[var(--three)] text-white": theme == "dark",
        })}>
            <h2 className='uppercase heading_s w-1/12 mb:w-1/2'><span>#</span>{invoice.id}</h2>
            <span className='body  w-2/12 ml-auto mb:w-1/2 mb:text-right'>{`Due ${date}`}</span>
            <span className='body w-2/12 mb:w-1/3'>{invoice.to_name}</span>
            <span className={clsx('heading_s text-[#0C0E16]  w-3/12 mb:w-1/3 ml-auto text-right mb:text-center', {
                " text-[#0C0E16]": theme == "light",
                " text-white": theme == "dark",
            })}>${invoice.total}</span>
            <Badge className={clsx('py-3 rounded-md heading-s w-3/12 mb:w-1/3 flex items-center justify-center gap-2 max-w-28 ml-auto', {
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
            <i className='max-w-1 h-2 block bg-[var(--one)] w-1/12 ml-auto mb:hidden' style={{
                mask: `url("${iconRight}") center / cover no-repeat`,
                WebkitMask: `url("${iconRight}") center / cover no-repeat`
            }}></i>
        </NavLink>
    )
})
const Filter = React.memo(({ filter, setFilter }: { filter: string, setFilter: (payload: string) => void }): React.JSX.Element => {
    console.log("re-render filter");
    const [open, setOpen] = React.useState(false)
    const { width } = React.useContext(WidthContext)
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
                        {filter ? filter : `Filter${width > 1023 ? " by Status" : ""}`}
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
                                            setFilter(value)
                                            setOpen(false)
                                        }} >
                                        <Checkbox id={status} className='data-[state=checked]:bg-[var(--one)]
                                         bg-[var(--five)] border-none outline-none hover:border-[var(--one)] hover:border-[1px] hover:border-solid ' checked={filter == status} />
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
})