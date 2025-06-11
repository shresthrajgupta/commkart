import { get } from 'mongoose';
import { USERS_URL } from '../../../constants.js';

import { apiSlice } from './apiSlice.js';


export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        login: builder.mutation({
            query: (credentials) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: credentials
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),

        register: builder.mutation({
            query: (userDetails) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: userDetails
            }),
        }),

        updateProfile: builder.mutation({
            query: (userDetails) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: userDetails
            })
        }),

        getAllUsers: builder.query({
            query: () => ({ url: USERS_URL }),
            providesTags: ['User'],
            keepUnusedDataFor: 5, // Cache for 5 seconds
        }),

        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['User']
        }),

        getUserDetails: builder.query({
            query: (userId) => ({ url: `${USERS_URL}/${userId}` }),
            keepUnusedDataFor: 5, // Cache for 5 seconds
        }),

        updateUserDetails: builder.mutation({
            query: (userDetails) => ({
                url: `${USERS_URL}/${userDetails.userId}`,
                method: 'PUT',
                body: userDetails
            }),
            invalidatesTags: ['User']
        }),

        getAddress: builder.query({
            query: () => ({ url: `${USERS_URL}/address` }),
            keepUnusedDataFor: 5, // Cache for 5 seconds
        }),

        addAddress: builder.mutation({
            query: (address) => ({
                url: `${USERS_URL}/address`,
                method: 'PUT',
                body: address
            })
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateProfileMutation, useGetAllUsersQuery, useDeleteUserMutation, useGetUserDetailsQuery, useUpdateUserDetailsMutation, useGetAddressQuery, useAddAddressMutation } = usersApiSlice;