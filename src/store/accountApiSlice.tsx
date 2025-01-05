import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    UserStatusResponse,
    UserLoginPayload,
    MergeCartResponse,
    MergeCartPayload,
    CheckUsernameAvailabilityResponse,
    UserSignUpPayload,
} from '../types/api/accountApiTypes';

const loginApiSlice = createApi({
    reducerPath: 'accountApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/account/',
        credentials: 'include',
    }),
    tagTypes: ['CurrentUser'],
    endpoints: (builder) => ({
        getUserStatus: builder.query<UserStatusResponse, void>({
            query: () => 'check-user-status/',
            providesTags: [{ type: 'CurrentUser', id: 'CURRENT_USER_INFO' }],
        }),
        login: builder.mutation<void, UserLoginPayload>({
            query: (payload) => ({
                url: 'login/',
                method: 'POST',
                body: payload,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: 'logout/',
                method: 'POST',
            }),
            onQueryStarted(arg, api) {
                api.queryFulfilled
                    .then(() => window.location.reload())
                    .catch(() => {});
            },
        }),
        refreshToken: builder.mutation<void, void>({
            query: () => ({
                url: 'token/refresh/',
                method: 'POST',
            }),
        }),
        mergeCart: builder.mutation<MergeCartResponse, MergeCartPayload>({
            query: (payload) => ({
                url: 'merge-cart/',
                method: 'POST',
                body: payload,
            }),
        }),
        checkUsernameAvailablility: builder.query<
            CheckUsernameAvailabilityResponse,
            string
        >({
            query: (username) => ({
                url: 'check/',
                params: {
                    username: username,
                },
            }),
        }),
        userSignUp: builder.mutation<void, UserSignUpPayload>({
            query: (payload) => ({
                url: 'sign-up/',
                method: 'POST',
                body: payload,
            }),
        }),
    }),
});

export const {
    useGetUserStatusQuery,
    useLazyGetUserStatusQuery,
    useLoginMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useMergeCartMutation,
    useLazyCheckUsernameAvailablilityQuery,
    useUserSignUpMutation,
    util,
} = loginApiSlice;
export default loginApiSlice;
