import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import type {
    SearchProductResponse,
    GetProductsParams,
    GetProductsResponse,
    GetAProductResponse,
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
        getProducts: builder.query<GetProductsResponse, GetProductsParams>({
            query: (params) => ({
                url: '',
                params: params
                    ? {
                          title: params.title,
                          collection: params.collection,
                          page: params.page,
                      }
                    : undefined,
            }),
        }),
        getAProduct: builder.query<GetAProductResponse, string>({
            query: (id) => ({
                url: `${id}/`,
            }),
        }),
    }),
});

export const {
    useLazyFetchSuggestionsQuery,
    useGetProductsQuery,
    useGetAProductQuery,
} = productApiSlice;
export default productApiSlice;
