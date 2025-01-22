import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
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
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { v4 } from "uuid"
import deleteIcon from "../../assets/icon-delete.svg";

const formSchema = z.object({
    fr_address: z.string().min(5).max(100),
    fr_city: z.string().min(3).max(50),
    fr_postCode: z.number().lte(999999),
    fr_country: z.string().min(3).max(50),
    to_name: z.string().min(3).max(50),
    to_email: z.string().email(),
    to_address: z.string().min(5).max(100),
    to_city: z.string().min(3).max(50),
    to_postCode: z.number().lte(999999),
    to_country: z.string().min(3).max(50),
    date: z.date(),
    term: z.string(),
    project: z.string().min(5).max(100),
    items: z.array(z.object({
        name: z.string().min(3).max(50),
        quantity: z.number().positive(),
        price: z.number().positive(),
        total: z.number().positive()
    }))
})
interface fieldUI {
    name: string,
    label: string,
    placeholder: string,
    width: string,
    type: string
}
const formUI =
{
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
            }
        ]
    },
}

export default function InvoiceForm(): React.JSX.Element {
    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {},
        resolver: zodResolver(formSchema)
    })
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-12">
                {
                    Object.values(formUI).map((section, index) => (
                        <fieldset key={index} className="flex flex-wrap gap-y-6 gap-6">
                            <legend className="text-[var(--one)] heading_s leading-4 mb-6">{section.name}</legend>
                            {
                                section.fields.map((fieldUI) => {
                                    if (fieldUI.type === "date") return <DatePicker key={v4()} form={form} fieldUI={fieldUI} />
                                    if (fieldUI.type == "text") return <InputText key={v4()} form={form} fieldUI={fieldUI} />
                                })
                            }
                        </fieldset>
                    ))
                }
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
                            <TableRow>
                                <TableCell className="font-medium">
                                    <Input style={{ boxShadow: "unset" }}
                                        className="focus:border-[var(--two)] heading_s leading-4 w-full"
                                        placeholder="Item Name"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input style={{ boxShadow: "unset" }}
                                        className="focus:border-[var(--two)] heading_s leading-4 w-full"
                                        placeholder="Qty."
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input style={{ boxShadow: "unset" }}
                                        className="focus:border-[var(--two)] heading_s leading-4 w-full"
                                        placeholder="Price"
                                    />
                                </TableCell>
                                <TableCell className="heading_s leading-4 text-[var(--six)]">
                                    0
                                </TableCell>
                                <TableCell className="heading_s leading-4 text-[var(--six)]">
                                    <i className="block cursor-pointer w-3 h-5 bg-[var(--six)] hover:bg-[var(--eight-red)]" style={{ mask: `url(${deleteIcon}) center / cover no-repeat`, WebkitMask: `url(${deleteIcon}) center / cover no-repeat` }}>

                                    </i>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </fieldset>


            </form>

        </Form >
    )
}
export const InputText = ({ form, fieldUI }: { fieldUI: fieldUI, form: UseFormReturn<z.infer<typeof formSchema>> }): React.JSX.Element => {
    return (
        <FormField
            control={form.control}
            name={fieldUI.name as keyof z.infer<typeof formSchema>}
            render={({ field }) => (
                <FormItem style={{ width: fieldUI.width == "full" ? "100%" : `calc(${fieldUI.width})` }} className="flex flex-col" >
                    <FormLabel className="body text-[var(--seven)]">{fieldUI.label}</FormLabel>
                    <FormControl>
                        <Input {...field} style={{ boxShadow: "unset" }} className=" focus:border-[var(--two)] heading_s leading-4 w-full" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
export const DatePicker = ({
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
                                    date > new Date() || date < new Date("1900-01-01")
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
}