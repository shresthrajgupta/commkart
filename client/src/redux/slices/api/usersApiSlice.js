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
            }),
        })
    }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateProfileMutation } = usersApiSlice;