export type AddressesResponse = {
    id: number;
    street: string;
    city: string;
    zip: string;
}[];

export interface UpdateAddressPayload {
    address_id: number;
    payload: {
        street?: string;
        city?: string;
        zip?: string;
    };
}
