import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import iconLeft from "../assets/icon-arrow-left.svg"
import InvoiceForm from "@/components/app/InvoiceForm";
import { AppContext } from "@/context/AppContext";

export default function Form(): React.JSX.Element {
    const navigate = useNavigate()
    const onBack = React.useCallback(() => { navigate(-1) }, [])
    const { id } = useParams()
    const { dispatch } = React.useContext(AppContext)
    React.useEffect(() => {
        if (id) dispatch({ type: "EDIT", payload: id })
    }, [id, dispatch])
    return (<>
        <div className="w-2/3 tb:w-full bg-white tb:px-8 mx-auto overflow-hidden mt-20">
            <div onClick={onBack} className="flex text-[#373B53] items-center gap-6 heading_s cursor-pointer">
                <i className='w-1 h-2 block bg-[var(--one)]' style={{
                    mask: `url("${iconLeft}") center/cover no-repeat`,
                    WebkitMask: `url("${iconLeft}") center/cover no-repeat`
                }}></i>
                Go back
            </div>
            <InvoiceForm />
        </div>
    </>)
}