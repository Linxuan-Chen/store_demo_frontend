import {
    createApi,
    fetchBaseQuery,
    TagDescription,
} from '@reduxjs/toolkit/query/react';
import type {
    CustomerResponse,
    UpdateCustomerPayload,
    UpdateCurrentCustomerPayload,
    UpdateCurrentCustomerResponse
} from '../types/api/customerApiTypes';
import { util as accountUtil } from './accountApiSlice';
import { util as addressUtil } from './addressApiSlice';

const customerApiSlice = createApi({
    reducerPath: 'customerAPi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/store/customers/',
        credentials: 'include',
    }),
    tagTypes: [
        'CurrentCustomer',
        'CustomerInfo',
        'CurrentUser',
        'CurrentAddress',
    ],
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
        updateCurrentCustomer: builder.mutation<
            void,
            UpdateCurrentCustomerPayload
        >({
            query: (payload) => ({
                url: 'current_user/',
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: [
                {
                    type: 'CurrentCustomer',
                    id: `CURRENT_CUSTOMER`,
                },
            ],
            onQueryStarted(arg, api) {
                api.queryFulfilled.then(() => {
                    api.dispatch(
                        accountUtil.invalidateTags([
                            { type: 'CurrentUser', id: 'CURRENT_USER_INFO' },
                        ])
                    );
                    api.dispatch(
                        addressUtil.invalidateTags([
                            { type: 'CurrentAddress', id: 'CURRENT_ADDRESS' },
                        ])
                    );
                });
            },
        }),
        updateCustomer: builder.mutation<UpdateCurrentCustomerResponse, UpdateCustomerPayload>({
            query: (params: UpdateCustomerPayload) => ({
                url: `${params.customer_id}/`,
                method: 'PATCH',
                body: params.payload,
            }),
            invalidatesTags: [
                {
                    type: 'CurrentCustomer',
                    id: `CURRENT_CUSTOMER`,
                },
            ],
        }),
    }),
});

export const {
    useCurrentCustomerQuery,
    useUpdateCustomerMutation,
    useUpdateCurrentCustomerMutation,
    util,
} = customerApiSlice;
export default customerApiSlice;
