import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import type {
    SearchProductResponse,
    GetProductsParams,
} from '../types/api/productApiTypes';

const productApiSlice = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/store/products/',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        fetchSuggestions: builder.query<SearchProductResponse, string>({
            query: (keyword) => ({
                url: 'suggestions/',
                params: {
                    keyword: keyword,
                },
            }),
        }),
        getProducts: builder.query<void, GetProductsParams>({
            query: (params) => ({
                url: '',
                params: params
                    ? {
                          title: params.title,
                          collection: params.collection,
                      }
                    : undefined,
            }),
        }),
    }),
});

export const { useLazyFetchSuggestionsQuery, useGetProductsQuery } =
    productApiSlice;
export default productApiSlice;
