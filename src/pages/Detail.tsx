import React from "react";
import iconLeft from "../assets/icon-arrow-left.svg"
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { AppContext } from "../context/AppContext";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge"
import Empty from "@/components/app/Empty";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeContext } from "@/context/ThemeContent";
export function Detail(): React.JSX.Element {
    const { state, dispatch } = React.useContext(AppContext)
    const { id } = useParams()
    const { toggleSidebar } = useSidebar()
    const [invoice, setInvoice] = React.useState<Invoice | null>(null)
    console.log("re-render Detail");
    const navigate = useNavigate()

    React.useEffect(() => {
        console.log(1);

        try {
            if (!state.data || state.data.length <= 0) {
                const localData = localStorage.getItem("data")
                if (localData) dispatch({ type: "INIT", payload: JSON.parse(localData) });
            } else {
                const current = state.data.find(el => el.id === id)
                setInvoice(current ?? null)
            }

        } catch (error) {
            console.log(error);
        }

    }, [state.data, id])

    const handleEdit = React.useCallback(() => {
        toggleSidebar()
        if (invoice) dispatch({ type: "EDIT", payload: invoice.id })
    }, [invoice])
    const handlePaid = React.useCallback(() => { if (invoice) dispatch({ type: "PAID", payload: invoice.id }) }, [invoice])
    const handleDelete = React.useCallback(() => { if (invoice) dispatch({ type: "DELETE", payload: invoice.id }) }, [invoice])
    const handleBack = React.useCallback(() => { navigate(-1) }, [])

    /* ở đây để chung thì mình biết kiểm soát 
    re-render do app context nó thay đổi, 
    nên mình tách ra để memo -> tránh được re-reder */
    return (<DetailUI invoice={invoice} onEdit={handleEdit} onPaid={handlePaid} onDelete={handleDelete} onBack={handleBack} />)
}
const DetailUI = React.memo(({ invoice, onEdit, onPaid, onDelete, onBack }: { invoice: Invoice | null, onEdit: () => void, onPaid: () => void, onDelete: () => void, onBack: () => void }) => {
    const { theme } = React.useContext(ThemeContext)
    const date = React.useMemo(() => {
        if (!invoice) return
        const dateObj = new Date(invoice.date);
        return dateObj.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }, [invoice])
    console.log("re-render UI", invoice);
    return <>
        <div className='w-2/3 tb:w-full tb:px-8 mx-auto overflow-hidden mt-20'>
            <div onClick={onBack} className={clsx("flex items-center gap-6 heading_s cursor-pointer", {
                "text-[#373B53]": theme == "light",
                "text-white": theme == "dark"
            })}>
                <i className='w-1 h-2 block bg-[var(--one)]' style={{
                    mask: `url("${iconLeft}") center/cover no-repeat`,
                    WebkitMask: `url("${iconLeft}") center/cover no-repeat`
                }}></i>
                Go back
            </div>
            {invoice &&

                <>
                    <div className={clsx("flex gap-3 items-center justify-start py-6 px-8 shadow-sm rounded-md mt-8", {
                        "bg-white text-black": theme == "light",
                        "bg-[var(--three)] text-white": theme == "dark"
                    })}>
                        Status
                        <Badge className={clsx('py-3  rounded-md heading-s flex items-center justify-center gap-2 ml-5 ', {
                            "bg-[#33D69F]/15 hover:bg-[#33D69F]/10 text-[#33D69F]": invoice.status == "Paid",
                            "bg-[#FF8F00]/15 hover:bg-[#FF8F00]/10 text-[#FF8F00]": invoice.status == "Pending",
                            "bg-[#373B53]/15 hover:bg-[#373B53]/10 ": invoice.status == "Draft",
                            "text-[#373B53]": invoice.status == "Draft" && theme == "light",
                            "text-white": invoice.status == "Draft" && theme == "dark"

                        })} > <span className={clsx('w-2 h-2 rounded-full', {
                            "bg-[#33D69F]": invoice.status == "Paid",
                            "bg-[#FF8F00]": invoice.status == "Pending",
                            "bg-[#373B53]": invoice.status == "Draft" && theme == "light",
                            "bg-white": invoice.status == "Draft" && theme == "dark"
                        })}></span> {invoice.status}</Badge>
                        <Button onClick={onEdit} type="button" className="w-fit bg-[var(--five)] text-[var(--six)] heading_s leading-4 py-5 rounded-2xl hover:bg-[var(--five)] ml-auto">Edit </Button>
                        <Button onClick={onDelete} type="button" className="w-fit bg-[var(--eight-red)] text-white heading_s leading-4 py-5 rounded-2xl hover:bg-[var(--four)] ">Delete</Button>
                        {invoice.status != "Paid" && <Button type="button" onClick={onPaid} className="w-fit bg-[var(--one)] text-white heading_s leading-4 py-5 rounded-2xl hover:bg-[var(--two)]">Mark As Paid</Button>}
                    </div>
                    <div className={clsx("py-6 px-8 shadow-sm rounded-md mt-8", {
                        "bg-white": theme == "light",
                        "bg-[var(--three)]": theme == "dark"
                    })}>
                        <div className=" flex flex-wrap gap-y-5">
                            <div className="uppercase heading_s w-1/2">
                                <h1><span className='text-[var(--seven)]'>#</span>{invoice.id}</h1>
                                <span className='text-[var(--seven)] body'>{invoice.project}</span>
                            </div>
                            <div className="w-1/2 text-[var(--seven)] body flex flex-col text-right">
                                <span>{invoice.fr_address}</span>
                                <span>{invoice.fr_city}</span>
                                <span>{invoice.fr_postCode}</span>
                                <span>{invoice.fr_country}</span>
                            </div>
                            <div className="w-1/3 text-[var(--seven)] body flex flex-col justify-between">
                                <span>Invoice Date</span>
                                <h2 className={clsx("heading_s ", {
                                    "text-black": theme == "light",
                                    "text-white": theme == "dark",
                                })}>{date}</h2>
                                <span>Payment Due</span>
                                <h2 className={clsx("heading_s ", {
                                    "text-black": theme == "light",
                                    "text-white": theme == "dark",
                                })}>{invoice.term}</h2>
                            </div>
                            <div className="w-1/3 text-[var(--seven)] body flex flex-col justify-between">
                                <span>Bill To</span>
                                <h2 className={clsx("heading_s ", {
                                    "text-black": theme == "light",
                                    "text-white": theme == "dark",
                                })}>{invoice.to_name}</h2>
                                <span>{invoice.to_address}</span>
                                <span>{invoice.to_city}</span>
                                <span>{invoice.to_postCode}</span>
                                <span>{invoice.to_country}</span>
                            </div>
                            <div className="w-1/3 text-[var(--seven)] body flex flex-col justify-start">
                                <span>Sent To</span>
                                <h2 className={clsx("heading_s ", {
                                    "text-black": theme == "light",
                                    "text-white": theme == "dark",
                                })}>{invoice.to_email}</h2>
                            </div>
                        </div>
                        <Table className="bg-[var(--eleven)] mt-8 rounded-lg">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Item Name</TableHead>
                                    <TableHead className="w-[15%]">Qty.</TableHead>
                                    <TableHead className="w-[30%]">Price</TableHead>
                                    <TableHead className="w-[10%]">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    invoice.items && invoice.items.map(item => <>
                                        <TableRow className=" heading_s">
                                            <TableCell className="text-black leading-4">
                                                {item.name}
                                            </TableCell>
                                            <TableCell className="text-[var(--seven)] ">
                                                ${item.quantity}
                                            </TableCell>
                                            <TableCell className="text-[var(--seven)] ">
                                                ${item.price}
                                            </TableCell>
                                            <TableCell className=" leading-4 text-black">
                                                ${item.quantity * item.price}
                                            </TableCell>

                                        </TableRow>
                                    </>)
                                }

                            </TableBody>
                            <TableFooter className="p-8 bg-[#373B53] rounded-b-lg ">
                                <TableRow className="text-white leading-4 heading_s">
                                    <TableCell colSpan={3}>Total</TableCell>
                                    <TableCell className="heading_m" >${invoice.items && invoice.items.reduce((sum, current) => sum + (current.price * current.quantity), 0)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </>}
            {!invoice && <Empty />}
        </div></>
})