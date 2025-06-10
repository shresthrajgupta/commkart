import { getTopProducts } from "../../../../../server/controllers/productController.js";
import { PRODUCTS_URL, UPLOAD_URL } from "../../../constants.js";

import { apiSlice } from "./apiSlice.js";


export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getAllProducts: builder.query({
            query: ({ pageNumber, keyword }) => ({ url: PRODUCTS_URL, params: { pageNumber, keyword } }),
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

        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: 'POST',
                body: data
            }),
        }),

        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Product']
        }),

        createReview: builder.mutation({
            query: (review) => ({
                url: `${PRODUCTS_URL}/${review.productId}/reviews`,
                method: 'POST',
                body: review
            }),

            invalidatesTags: ['Product']
        }),

        getTopProducts: builder.query({
            query: () => ({ url: `${PRODUCTS_URL}/top` }),
            keepUnusedDataFor: 5, // Cache for 5 seconds
        }),
    })
});

export const { useGetAllProductsQuery, useGetProductDetailsQuery, useCreateProductMutation, useUpdateProductMutation, useUploadProductImageMutation, useDeleteProductMutation, useCreateReviewMutation, useGetTopProductsQuery } = productsApiSlice;