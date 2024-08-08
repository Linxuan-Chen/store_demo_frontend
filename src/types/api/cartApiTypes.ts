export interface CartItemCount {
    count: Number;
}

export interface CreateNewCart {
    id: string;
}

interface SimpleProduct {
    id: number;
    title: string;
    inventory: number;
    unit_price: number;
}

export interface CartItem {
    id: number;
    quantity: number;
    product: SimpleProduct;
    total_price: number;
}

export interface CartInfoResponse {
    cart_total_price: number;
    created_at: string;
    id: string;
    items: Array<CartItem>;
}

export interface UpdateCartItemParams {
    cart_id: string;
    cart_item_id: number;
    payload: {
        quantity: number;
    };
}

export interface DeleteCartItemParams {
    cart_id: string;
    cart_item_id: number;
}

export interface BulkDeleteCartItemParams {
    cart_id: string;
    item_ids: readonly number[];
}
