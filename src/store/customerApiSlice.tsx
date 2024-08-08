import {
    createApi,
    fetchBaseQuery,
    TagDescription,
} from '@reduxjs/toolkit/query/react';
import type {
    CustomerResponse,
    UpdateCustomerPayload,
} from '../types/api/customerApiTypes';

const customerApiSlice = createApi({
    reducerPath: 'customerAPi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/store/customers/',
        credentials: 'include',
    }),
    tagTypes: ['CurrentCustomer', 'CustomerInfo'],
    endpoints: (builder) => ({
        currentCustomer: builder.query<CustomerResponse, void>({
            query: () => 'current_user/',
            providesTags: (result) => {
                let tags: TagDescription<'CurrentCustomer' | 'CustomerInfo'>[] =
                    [
                        {
                            type: 'CurrentCustomer',
                            id: `CURRENT_CUSTOMER`,
                        },
                    ];
                return tags;
            },
        }),
        updateCustomer: builder.mutation<void, UpdateCustomerPayload>({
            query: (params: UpdateCustomerPayload) => ({
                url: `${params.customer_id}/`,
                method: 'PATCH',
                body: params.payload,
            }),
            invalidatesTags: (result, error, params) => {
                return [
                    {
                        type: 'CurrentCustomer',
                        id: `CURRENT_CUSTOMER`,
                    },
                ];
            },
        }),
    }),
});

export const { useCurrentCustomerQuery, useUpdateCustomerMutation, util } =
    customerApiSlice;
export default customerApiSlice;
