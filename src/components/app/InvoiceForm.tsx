import React from "react";
import { useFieldArray, useForm, UseFormReturn, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Calendar } from "@/components/ui/calendar"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import deleteIcon from "../../assets/icon-delete.svg";
import { useSidebar } from '../ui/sidebar'
import { AppContext } from "@/context/AppContext";


const formSchema = z.object({
    fr_address: z.coerce.string().min(5).max(100),
    fr_city: z.coerce.string().min(3).max(50),
    fr_postCode: z.coerce.string(),
    fr_country: z.coerce.string().min(3).max(50),
    to_name: z.coerce.string().min(3).max(50),
    to_email: z.coerce.string().email(),
    to_address: z.coerce.string().min(5).max(100),
    to_city: z.coerce.string().min(3).max(50),
    to_postCode: z.coerce.string(),
    to_country: z.coerce.string().min(3).max(50),
    date: z.coerce.date(),
    term: z.coerce.string(),
    project: z.coerce.string().min(5).max(100),
    items: z.array(z.object({
        name: z.coerce.string().min(3).max(50),
        quantity: z.coerce.number().positive(),
        price: z.coerce.number().positive(),
        total: z.coerce.number().positive()
    }))
})
interface fieldUI {
    name: string,
    label: string,
    placeholder: string,
    width: string,
    type: string
}


export default function InvoiceForm(): React.JSX.Element {
    const { setOpen } = useSidebar()
    const { state, dispatch } = React.useContext(AppContext)
    const formUI = React.useMemo(() => ({
        form: {
            name: "Bill Form",
            fields: [
                {
                    name: "fr_address",
                    label: "Street Address",
                    placeholder: "Street Address",
                    width: "full",
                    type: "text"
                },
                {
                    name: "fr_city",
                    label: "City",
                    placeholder: "City",
                    width: "100%/3 - 1rem",
                    type: "text"
                },
                {
                    name: "fr_postCode",
                    label: "PostCode",
                    placeholder: "PostCode",
                    width: "100%/3 - 1rem",
                    type: "text"
                },
                {
                    name: "fr_country",
                    label: "Country",
                    placeholder: "Country",
                    width: "100%/3 - 1rem",
                    type: "text"
                }
            ]
        },
        to: {
            name: "Bill To",
            fields: [
                {
                    name: "to_name",
                    label: "Client’s Name",
                    placeholder: "Client’s Name",
                    width: "full",
                    type: "text"
                },
                {
                    name: "to_email",
                    label: "Client’s Email",
                    placeholder: "Client’s Email",
                    width: "full",
                    type: "text"
                },
                {
                    name: "to_address",
                    label: "Street Address",
                    placeholder: "Street Address",
                    width: "full",
                    type: "text"
                },
                {
                    name: "to_city",
                    label: "City",
                    placeholder: "City",
                    width: "100%/3 - 1rem",
                    type: "text"
                },
                {
                    name: "to_postCode",
                    label: "PostCode",
                    placeholder: "PostCode",
                    width: "100%/3 - 1rem",
                    type: "text"
                },
                {
                    name: "to_country",
                    label: "Country",
                    placeholder: "Country",
                    width: "100%/3 - 1rem",
                    type: "text"
                },
                {
                    name: "date",
                    label: "Invoice Date",
                    placeholder: "Invoice Date",
                    width: "50% - 0.75rem",
                    type: "date"
                },
                {
                    name: "term",
                    label: "Payment Terms",
                    placeholder: "Payment Terms",
                    width: "50% - 0.75rem",
                    type: "text"
                },
                {
                    name: "project",
                    label: "Project Description",
                    placeholder: "e.g. Graphic Design Service",
                    width: "100%",
                    type: "text"
                }
            ]
        },
    }), [])

    const defaultValue = {
        fr_address: "111111111",
        fr_city: "",
        fr_postCode: "0",
        fr_country: "",
        to_name: "",
        to_email: "",
        to_address: "",
        to_city: "",
        to_postCode: "0",
        to_country: "",
        date: new Date(),
        term: "",
        project: "",
        items: []
    }

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: defaultValue,
        resolver: zodResolver(formSchema)
    })
    React.useEffect(() => {
        if (state.editing) {
            const invoice = state.data.find(el => el.id == state.editing)
            if (invoice) {
                Object.entries(invoice).forEach(([key, value]) => {
                    form.setValue(key as keyof z.infer<typeof formSchema>, value);
                });
            }
        }
    }, [state.editing])
    const onSubmit = async (data: z.infer<typeof formSchema>, type: string) => {
        try {
            dispatch({
                type: "UPDATEORSAVE", payload: {
                    ...data, status: type,
                    total: data.items.reduce((prev, current) => prev + current.total, 0)
                } as unknown as Invoice
            })
            setOpen(false)
        } catch (error) {
            console.log(error);

        }
    }
    const onInvalid = (errors: any) => {
        console.error("Validation errors:", errors); // In ra lỗi validation
    };
    return (<>
        <h2 className="heading_m">{state.editing ? `Edit #${state.editing}` : "New Invoice"}</h2>
        <Form {...form}>
            <form className="flex flex-col gap-12 overflow-y-scroll overflow-x-hidden scrollbar-thin">
                {
                    Object.values(formUI).map((section, index) => (
                        <fieldset key={index} className="flex flex-wrap gap-y-6 gap-6">
                            <legend className="text-[var(--one)] heading_s leading-4 mb-6">{section.name}</legend>
                            {
                                section.fields.map((fieldUI) => {
                                    const fieldKey = `${section.name}_${fieldUI.name}_${index}`;

                                    if (fieldUI.type === "date") return <DatePicker key={fieldKey} form={form} fieldUI={fieldUI} />
                                    if (fieldUI.type == "text" || fieldUI.type == "number") return <InputText key={fieldKey} form={form} fieldUI={fieldUI} />
                                })
                            }
                        </fieldset>
                    ))
                }
                <ItemLists form={form} />
                <div className="flex items-center gap-6">
                    <Button type="button" onClick={() => setOpen(false)} className="w-fit mt-10 bg-[var(--five)] text-[var(--six)] heading_s leading-4 py-5 rounded-2xl hover:bg-[var(--five)]">Discard </Button>
                    {!state.editing && <Button type="submit" onClick={form.handleSubmit((data) => onSubmit(data, "Draft"), onInvalid)} className="w-fit mt-10 bg-[var(--three)] text-white heading_s leading-4 py-5 rounded-2xl hover:bg-[var(--four)] ml-auto">Save As Draft</Button>}
                    <Button type="submit" onClick={form.handleSubmit((data) => onSubmit(data, "Pending"), onInvalid)} className="w-fit mt-10 bg-[var(--one)] text-white heading_s leading-4 py-5 rounded-2xl hover:bg-[var(--two)]"> {state.editing ? "Save Changes" : "Save & Send"}</Button>
                </div>
            </form>

        </Form >
    </>
    )
}
const getFieldUI = (index: number, type: "quantity" | "name" | "price") => ({
    name: `items.${index}.${type}`,
    label: "",
    placeholder: type === "name" ? "Item Name" : type === "quantity" ? "Qty." : "Price",
    width: "full",
    type: type === "name" ? "text" : "number"
})
const ItemLists = ({ form }: { form: UseFormReturn<z.infer<typeof formSchema>> }) => {

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });
    const addItem = React.useCallback(() => {
        append({ name: "", quantity: 0, price: 0, total: 0 })
    }, [])
    const handleRemove = React.useCallback((index: number) => {
        remove(index)
    }, [])
    return (
        <fieldset>
            <legend className="text-[#777F98] font-bold text-[1.125ren] tracking-[-0.38px] leading-8">Item List</legend>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Item Name</TableHead>
                        <TableHead className="w-[15%]">Qty.</TableHead>
                        <TableHead className="w-[30%]">Price</TableHead>
                        <TableHead className="w-[10%]">Total</TableHead>
                        <TableHead className="w-[5%]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        fields.map((field, index) => (
                            <CustomTableRow key={field.id} index={index} form={form} onRemove={handleRemove} />
                        ))
                    }
                </TableBody>
            </Table>
            <Button onClick={addItem} type="button" className="w-full mt-10 bg-[#F9FAFE] text-[var(--seven)] heading_s leading-4 py-5 rounded-2xl border-solid border-[1px] hover:border-[var(--two)] hover:bg-[#F9FAFE]"> + Add New Item</Button>
        </fieldset>
    )
}
export const CustomTableRow = React.memo(({ form, onRemove, index }: { index: number, form: UseFormReturn<z.infer<typeof formSchema>>, onRemove: (index: number) => void }): React.JSX.Element => {
    const data = useWatch({
        control: form.control,
        name: `items.${index}`
    });

    const totalRef = React.useRef<HTMLTableCellElement>(null)
    React.useEffect(() => {
        const total = data.price * data.quantity
        form.setValue(`items.${index}.total`, total)
        if (totalRef.current) totalRef.current.innerText = total.toString()
    }, [data.price, data.quantity, form, index])
    const nameUI = getFieldUI(index, "name")
    const qtyUI = getFieldUI(index, "quantity")
    const priceUI = getFieldUI(index, "price")
    return (
        <TableRow>
            <TableCell className="font-medium">
                <InputText key={nameUI.name} form={form} fieldUI={nameUI} />
            </TableCell>
            <TableCell>
                <InputText key={qtyUI.name} form={form} fieldUI={qtyUI} />
            </TableCell>
            <TableCell>
                <InputText key={priceUI.name} form={form} fieldUI={priceUI} />
            </TableCell>
            <TableCell ref={totalRef} className="heading_s leading-4 text-[var(--six)]">

            </TableCell>
            <TableCell className="heading_s leading-4 text-[var(--six)]">
                <i onClick={() => onRemove(index)} className="block cursor-pointer w-3 h-4 bg-[var(--six)] hover:bg-[var(--eight-red)]"
                    style={{ mask: `url("${deleteIcon}") center / cover no-repeat`, WebkitMask: `url("${deleteIcon}") center / cover no-repeat` }} />
            </TableCell>
        </TableRow>
    )
})
export const InputText = React.memo(({ form, fieldUI }: { fieldUI: fieldUI, form: UseFormReturn<z.infer<typeof formSchema>> }): React.JSX.Element => {
    const { register } = form;
    return (
        <FormField
            control={form.control}
            name={fieldUI.name as keyof z.infer<typeof formSchema>}
            render={({ field }) => (
                <FormItem style={{ width: fieldUI.width == "full" ? "100%" : `calc(${fieldUI.width})` }} className="flex flex-col" >
                    {fieldUI.label && <FormLabel className="body text-[var(--seven)]">{fieldUI.label}</FormLabel>}
                    <FormControl>
                        <Input {...field} type={fieldUI.type}
                            value={(() => {
                                if (Array.isArray(field.value)) return
                                return field.value instanceof Date ? field.value.toISOString() : field.value
                            })()}
                            {...register(fieldUI.name as keyof z.infer<typeof formSchema>)} style={{ boxShadow: "unset" }} className=" focus:border-[var(--two)] heading_s leading-4 w-full" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
})
export const DatePicker = React.memo(({
    fieldUI, form
}: {
    fieldUI: fieldUI,
    form: UseFormReturn<z.infer<typeof formSchema>>
}): React.JSX.Element => {
    return (
        <FormField
            control={form.control}
            name={fieldUI.name as keyof z.infer<typeof formSchema>}
            render={({ field }) => (
                <FormItem style={{ width: fieldUI.width == "full" ? "100%" : `calc(${fieldUI.width})` }} className="flex flex-col">
                    <FormLabel className="body text-[var(--seven)]">{fieldUI.label}</FormLabel>
                    <Popover >
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal ",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value as Date, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value as Date}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
})