import type { AddressesResponse } from './addressApiTypes';

export interface CustomerResponse {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    membership: 'G' | 'S' | 'B';
    customer_details: [] | null;
    addresses: AddressesResponse;
}

export interface UpdateCustomerPayload {
    customer_id: number;
    payload: {
        address?: {
            street: string;
            city: string;
            zip: string;
        };
    };
}
