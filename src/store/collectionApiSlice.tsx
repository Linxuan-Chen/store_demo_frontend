import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CollectionListResponse } from '../types/api/collectionApiTypes';


const collectionApiSlice = createApi({
    reducerPath: 'collectionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/store/',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getCollectionList: builder.query<CollectionListResponse[],void>({
            query: () => 'collections/',
        }),
    }),
});

export const { useGetCollectionListQuery } = collectionApiSlice;
export default collectionApiSlice;
