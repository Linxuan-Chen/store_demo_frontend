import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    AddressesResponse,
    UpdateAddressPayload,
} from '../types/api/addressApiTypes';
import { util } from './customerApiSlice';

const addressApiSlice = createApi({
    reducerPath: 'addressApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/store/',
        credentials: 'include',
    }),
    tagTypes: ['CurrentCustomer', 'CustomerInfo'],
    endpoints: (builder) => ({
        getAddresses: builder.query<AddressesResponse, void>({
            query: () => 'addresses/',
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
                        util.invalidateTags([
                            {
                                type: 'CurrentCustomer',
                                id: `CURRENT_CUSTOMER`,
                            },
                        ])
                    );
                });
            },
        }),
        deleteAddress: builder.mutation<void, number>({
            query: (address_id) => ({
                url: `addresses/${address_id}/`,
                method: 'DELETE',
            }),
            onQueryStarted: (params, api) => {
                api.queryFulfilled.then(() => {
                    api.dispatch(
                        util.invalidateTags([
                            {
                                type: 'CurrentCustomer',
                                id: `CURRENT_CUSTOMER`,
                            },
                        ])
                    );
                });
            },
        }),
    }),
});

export const {
    useGetAddressesQuery,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
} = addressApiSlice;
export default addressApiSlice;
