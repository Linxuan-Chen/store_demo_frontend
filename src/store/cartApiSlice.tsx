import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CartItemCount, CreateNewCart } from '../types/api/cartApiTypes';

const cartApiSlice = createApi({
    reducerPath: 'cartApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/store/',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getCartItemCount: builder.query<CartItemCount, string | null>({
            query: (id) => `/cart/${id}/items/count/`,
        }),
        createNewCart: builder.mutation<CreateNewCart, void>({
            query: () => ({
                url: '/cart/',
                method: 'POST',
            }),
        }),
    }),
});

export const { useGetCartItemCountQuery, useCreateNewCartMutation } =
    cartApiSlice;
export default cartApiSlice;
