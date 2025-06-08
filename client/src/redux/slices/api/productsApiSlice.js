import { PRODUCTS_URL } from "../../../constants.js";

import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getProducts: builder.query({
            query: () => ({ url: PRODUCTS_URL }),
            keepUnusedDataFor: 5, // Cache for 5 seconds
        }),

        getProductDetails: builder.query({
            query: (productId) => ({ url: `${PRODUCTS_URL}/${productId}` }),
            keepUnusedDataFor: 5, // Cache for 5 seconds
        }),
    }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } = productsApiSlice;