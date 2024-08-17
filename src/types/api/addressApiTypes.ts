export type AddressesResponse = {
    id: number;
    street: string;
    city: string;
    zip: string;
    is_default: boolean;
}[];

export interface UpdateAddressPayload {
    address_id: number;
    payload: {
        street?: string;
        city?: string;
        zip?: string;
        is_default?: boolean;
    };
}
