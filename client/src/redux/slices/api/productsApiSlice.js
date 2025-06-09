import { PRODUCTS_URL } from "../../../constants.js";

import { apiSlice } from "./apiSlice.js";


export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getAllProducts: builder.query({
            query: () => ({ url: PRODUCTS_URL }),
            providesTags: ['Product'],
            keepUnusedDataFor: 5, // Cache for 5 seconds
        }),

        getProductDetails: builder.query({
            query: (productId) => ({ url: `${PRODUCTS_URL}/${productId}` }),
            keepUnusedDataFor: 5, // Cache for 5 seconds
        }),

        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: 'POST'
            }),

            invalidatesTags: ['Product']
        }),

        updateProduct: builder.mutation({
            query: (productData) => ({
                url: `${PRODUCTS_URL}/${productData.productId}`,
                method: 'PUT',
                body: productData
            }),

            invalidatesTags: ['Product']
        }),
    }),
});

export const { useGetAllProductsQuery, useGetProductDetailsQuery, useCreateProductMutation, useUpdateProductMutation } = productsApiSlice;