export interface UserStatusResponse {
    cart_id: number;
    first_name: string;
}

export interface UserLoginPayload {
    username: string;
    password: string;
    keep_me_signed_in: boolean;
}

export interface MergeCartResponse {
    anonymous_cart_id: string;
}

export interface MergeCartPayload {
    anonymous_cart_id: string | null;
}
