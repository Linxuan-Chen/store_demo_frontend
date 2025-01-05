export interface UserStatusResponse {
    cart_id: number;
    first_name: string;
    default_address: string;
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

export interface UserSignUpPayload {
    username: string;
    password: string;
    repeat_password: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface CheckUsernameAvailabilityResponse {
    is_available: boolean;
    message: string;
}
