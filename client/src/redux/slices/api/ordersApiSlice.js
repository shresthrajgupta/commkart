import { ORDERS_URL, PAYPAL_URL, RAZORPAY_URL } from '../../../constants.js';

import { apiSlice } from './apiSlice.js';


export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: { ...order }
            })
        }),

        getOrderDetails: builder.query({
            query: (orderId) => ({ url: `${ORDERS_URL}/${orderId}` }),
            keepUnusedDataFor: 5
        }),

        getPayPalClientId: builder.query({
            query: () => ({ url: PAYPAL_URL }),
            keepUnusedDataFor: 5
        }),

        payOrderPayPal: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/paypal`,
                method: 'PUT',
                body: { ...details }
            })
        }),

        getRazorpayApiKey: builder.query({
            query: () => ({ url: RAZORPAY_URL }),
            keepUnusedDataFor: 5
        }),

        initializeOrderRazorpay: builder.mutation({
            query: ({ orderIdDb, amount }) => {
                return {
                    url: `${ORDERS_URL}/${orderIdDb}/razorpay`,
                    method: 'POST',
                    body: { amount }
                }
            }
        }),

        verifyOrderRazorpay: builder.mutation({
            query: ({ orderIdDb, razorpayObject }) => {
                return {
                    url: `${ORDERS_URL}/${orderIdDb}/razorpay`,
                    method: 'PUT',
                    body: { ...razorpayObject }
                }
            }
        }),

        getMyOrders: builder.query({
            query: () => ({ url: `${ORDERS_URL}/myorders` }),
            keepUnusedDataFor: 5
        }),

        getAllOrders: builder.query({
            query: () => ({ url: `${ORDERS_URL}` }),
            keepUnusedDataFor: 5
        }),

        markDelivered: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT'
            })
        }),
    })
});

export const { useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderPayPalMutation, useInitializeOrderRazorpayMutation, useGetPayPalClientIdQuery, useGetRazorpayApiKeyQuery, useGetMyOrdersQuery, useGetAllOrdersQuery, useMarkDeliveredMutation, useVerifyOrderRazorpayMutation } = ordersApiSlice;