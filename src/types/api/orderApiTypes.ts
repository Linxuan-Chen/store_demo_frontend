import { ProductImageType } from "./productApiTypes";

export interface PlaceOrderParams {
    cart_id: string;
    address_id: number;
}

export type OrderResponse = {
    count: number;
    previous: number;
    next: number;
    results: {
        id: number;
        customer: number;
        created_at: string;
        payment_status: 'P' | 'C' | 'F';
        items: OrderItem[];
        total_price: number;
        address: string;
    }[];
};

export interface OrderItem {
    id: number;
    product_title: string;
    quantity: number;
    unit_price: number;
    image: ProductImageType[number];
}
