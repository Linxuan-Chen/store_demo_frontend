import type { AddressesResponse } from './addressApiTypes';

export interface CustomerResponse {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    membership: 'G' | 'S' | 'B';
    customer_details: {
        phone: string;
        birth_date: string;
        email: string;
    } | null;
    addresses: AddressesResponse;
}
export interface UpdateCurrentCustomerResponse {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    membership: 'G' | 'S' | 'B';
    customer_details: {
        phone: string;
        birth_date: string;
        email: string;
    } | null;
    address: AddressesResponse[number];
}

export interface UpdateCustomerPayload {
    customer_id: number;
    payload: {
        [index: string]: any;
        address?: {
            street: string;
            city: string;
            zip: string;
        };
        first_name?: string;
        last_name?: string;
        customer_details?: {
            [index: string]: any;
            email?: string;
            phone?: string;
            birth_date?: string;
        };
    };
}
export interface UpdateCurrentCustomerPayload {
    [index: string]: any;
    address?: {
        street?: string;
        city?: string;
        zip?: string;
        is_default?: boolean;
    };
    first_name?: string;
    last_name?: string;
    customer_details?: {
        [index: string]: any;
        email?: string;
        phone?: string;
        birth_date?: string;
    };
}
