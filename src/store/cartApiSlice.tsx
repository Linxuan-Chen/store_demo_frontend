import {
    createApi,
    fetchBaseQuery,
    TagDescription,
} from '@reduxjs/toolkit/query/react';
import type {
    CartItemCount,
    CartInfoResponse,
    CreateNewCart,
    UpdateCartItemParams,
    DeleteCartItemParams
} from '../types/api/cartApiTypes';

const cartApiSlice = createApi({
    reducerPath: 'cartApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/store/',
        credentials: 'include',
    }),
    tagTypes: ['CartItem', 'Cart'],
    endpoints: (builder) => ({
        getCartItemCount: builder.query<CartItemCount, string | null>({
            query: (id) => `cart/${id}/items/count/`,
        }),
        createNewCart: builder.mutation<CreateNewCart, void>({
            query: () => ({
                url: 'cart/',
                method: 'POST',
            }),
        }),
        getCartInfo: builder.query<CartInfoResponse, string>({
            query: (cartId) => ({
                url: `cart/${cartId}/`,
            }),
            providesTags: (results) => {
                let tags: TagDescription<'CartItem' | 'Cart'>[] = [
                    { type: 'Cart', id: 'CART' },
                ];
                if (results) {
                    tags = [
                        ...results.items.map((item) => ({
                            type: 'CartItem' as 'CartItem',
                            id: `CARTITEM${item.id}`,
                        })),
                        { type: 'Cart', id: 'CART' },
                    ];
                }
                return tags;
            },
        }),
        updateCartItem: builder.mutation<Response, UpdateCartItemParams>({
            query: (params) => ({
                url: `cart/${params.cart_id}/items/${params.cart_item_id}/`,
                method: 'PATCH',
                body: params.payload,
            }),
            invalidatesTags: (result, error, { cart_item_id }) => [
                { type: 'CartItem', id: `CARTITEM${cart_item_id}` },
            ],
        }),
        deleteCartItem: builder.mutation<Response, DeleteCartItemParams>({
            query: (params) => ({
                url: `cart/${params.cart_id}/items/${params.cart_item_id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { cart_item_id }) => [
                { type: 'CartItem', id: `CARTITEM${cart_item_id}` },
            ],
        }),
    }),
});

export const {
    useGetCartItemCountQuery,
    useCreateNewCartMutation,
    useGetCartInfoQuery,
    useUpdateCartItemMutation,
    useDeleteCartItemMutation
} = cartApiSlice;
export default cartApiSlice;
