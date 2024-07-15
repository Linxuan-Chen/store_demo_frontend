import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import BASE_URL from '../config';

interface CartItemCount {
    count: Number;
}

interface CreateNewCart {
    id: string;
}

const cartApiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/store/`,
    }),
    endpoints: (builder) => ({
        getCartItemCount: builder.query<CartItemCount, string>({
            query: (id) => `cart/${id}/items/count/`,
        }),
        createNewCart: builder.mutation<CreateNewCart, Object>({
            query: () => ({
                url: 'cart/',
                method: 'POST',
                payload: {},
            }),
        }),
    }),
});

export const { useGetCartItemCountQuery, useCreateNewCartMutation } = cartApiSlice;
export default cartApiSlice;
