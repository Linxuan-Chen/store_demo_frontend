import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    AddressesResponse,
    UpdateAddressPayload,
} from '../types/api/addressApiTypes';
import { util as customerUtil } from './customerApiSlice';

const addressApiSlice = createApi({
    reducerPath: 'addressApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/store/',
        credentials: 'include',
    }),
    tagTypes: ['CurrentCustomer', 'CustomerInfo', 'CurrentAddress'],
    endpoints: (builder) => ({
        getAddresses: builder.query<AddressesResponse, void>({
            query: () => 'addresses/',
            providesTags: [{ type: 'CurrentAddress', id: 'CURRENT_ADDRESS' }],
        }),
        updateAddress: builder.mutation<void, UpdateAddressPayload>({
            query: (params) => ({
                url: `addresses/${params.address_id}/`,
                body: params.payload,
                method: 'PATCH',
            }),
            onQueryStarted: (params, api) => {
                api.queryFulfilled.then(() => {
                    api.dispatch(
                        customerUtil.invalidateTags([
                            {
                                type: 'CurrentCustomer',
                                id: `CURRENT_CUSTOMER`,
                            },
                        ])
                    );
                });
            },
            invalidatesTags: [
                { type: 'CurrentAddress', id: 'CURRENT_ADDRESS' },
            ],
        }),
        deleteAddress: builder.mutation<void, number>({
            query: (address_id) => ({
                url: `addresses/${address_id}/`,
                method: 'DELETE',
            }),
            onQueryStarted: (params, api) => {
                api.queryFulfilled.then(() => {
                    api.dispatch(
                        customerUtil.invalidateTags([
                            {
                                type: 'CurrentCustomer',
                                id: `CURRENT_CUSTOMER`,
                            },
                        ])
                    );
                });
            },
            invalidatesTags: [
                { type: 'CurrentAddress', id: 'CURRENT_ADDRESS' },
            ],
        }),
    }),
});

export const {
    useGetAddressesQuery,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    util
} = addressApiSlice;
export default addressApiSlice;
