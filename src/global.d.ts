declare global {
    interface Invoice {
        id: string
        fr_address: string,
        fr_city: string,
        fr_postCode: string,
        fr_country: string,
        to_name: string,
        to_email: string,
        to_address: string,
        to_city: string,
        to_postCode: string,
        to_country: string,
        date: Date,
        term: string,
        project: string,
        items:
        {
            name: string,
            quantity: number,
            price: number
        }[],
        status: string,
        total: number,
    }
}
export { }