import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };


const addDecimals = (num) => {
    return (Math.round(parseFloat(num) * 100) / 100).toFixed(2);
};

const updateCart = (state) => {
    // calculate items price
    state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.quantity)), 0));

    // calculate shipping price (free if items price > 100)
    state.shippingPrice = ((state.itemsPrice > 100) ? 0 : 10);

    // calculate tax price
    state.taxPrice = addDecimals(0 * state.itemsPrice);

    // calculate total price
    state.totalPrice = addDecimals(state.itemsPrice + state.shippingPrice + state.taxPrice);

    localStorage.setItem("cart", JSON.stringify(state));
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.cartItems.find((x) => x._id === item._id);

            if (existingItem) {
                state.cartItems = state.cartItems.map((x) => x._id === existingItem._id ? item : x);
            } else {
                state.cartItems.push(item); // immutable but allowed only in RTK
            }

            return updateCart(state);
        },

        removeFromCart: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((x) => x._id !== itemId);
            return updateCart(state);
        },

        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },

        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            return updateCart(state);
        },

        clearCartItems: (state, action) => {
            state.cartItems = [];
            return updateCart(state);
        },

        resetCart: (state) => (state = initialState)
    }
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems, resetCart } = cartSlice.actions;

export default cartSlice.reducer;