import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    PlaceOrderParams,
    OrderResponse,
} from '../types/api/orderApiTypes';
import { util } from './cartApiSlice';

const orderApiSlice = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/store/orders/',
        credentials: 'include',
    }),
    tagTypes: ['CartItem', 'Cart', 'CartCount', 'Order'],
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
            invalidatesTags: () => [{ type: 'Order', id: 'ORDER_LIST' }],
        }),
        getOrder: builder.query<OrderResponse, number>({
            query: (page) => ({
                url: '/',
                params: {
                    page: page,
                },
            }),
            providesTags: [{ type: 'Order', id: 'ORDER_LIST' }],
        }),
    }),
});

export const { usePlaceOrderMutation, useGetOrderQuery } = orderApiSlice;
export default orderApiSlice;
