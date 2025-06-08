import asyncHandler from "../middlewares/asyncHandler.js";

import Order from "../models/orderModel.js";

const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    } else {
        const order = new Order({
            user: req.user._id,

            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined
            })),

            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params._id).populate('user', 'name email');

    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

const getOrderById = asyncHandler(async (req, res) => {
    res.send("get order by id");
});

// admin controllers

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    res.send("update Order To Delivered");
});

const getAllOrders = asyncHandler(async (req, res) => {
    res.send("get All Orders");
});

export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getAllOrders };