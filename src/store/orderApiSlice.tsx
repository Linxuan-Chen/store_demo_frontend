import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PlaceOrderParams } from '../types/api/orderApiTypes';
import { util } from './cartApiSlice';

const orderApiSlice = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/store/orders/',
        credentials: 'include',
    }),
    tagTypes: ['CartItem', 'Cart', 'CartCount'],
    endpoints: (builder) => ({
        placeOrder: builder.mutation<Response, PlaceOrderParams>({
            query: (params) => ({
                url: '',
                body: {
                    ...params,
                },
                method: 'POST',
            }),
            onQueryStarted: (params, api) => {
                api.queryFulfilled.then(() => {
                    api.dispatch(
                        util.invalidateTags([
                            { type: 'Cart', id: 'CART' },
                            { type: 'CartCount', id: 'CART_COUNT' },
                        ])
                    );
                });
            },
        }),
    }),
});

export const { usePlaceOrderMutation } = orderApiSlice;
export default orderApiSlice;
