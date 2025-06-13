import crypto from 'crypto';

import asyncHandler from "../middlewares/asyncHandler.js";

import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

import { calcPrices } from "../utils/calcPrices.js";
import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";
import { instance } from "../utils/razorpay.js";


const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        // get the ordered items from our database
        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id) },
        });

        // map over the order items and use the price from our items from database
        const dbOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDB = itemsFromDB.find((itemFromDB) => itemFromDB._id.toString() === itemFromClient._id);

            return {
                ...itemFromClient,
                product: itemFromClient._id,
                price: matchingItemFromDB.price,
                _id: undefined,
            };
        });

        // calculate prices
        const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
            calcPrices(dbOrderItems);

        const order = new Order({
            orderItems: dbOrderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

const updateOrderToPaidPayPal = asyncHandler(async (req, res) => {
    const { verified, value } = await verifyPayPalPayment(req.body.id);
    if (!verified) throw new Error('Payment not verified');

    // check if this transaction has been used before
    const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
    if (!isNewTransaction) throw new Error('Transaction has been used before');

    const order = await Order.findById(req.params.id);

    if (order) {
        // check the correct amount was paid
        const paidCorrectAmount = Number(order.totalPrice).toFixed(2) === Number(value).toFixed(2);

        if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

const initializeOrderRazorpay = asyncHandler(async (req, res) => {
    // check if ordered is already paid
    const orderDB = await Order.findById(req.params.id);

    if (!orderDB) {
        res.status(404);
        throw new Error("Order not found");
    }
    if (orderDB.isPaid) {
        res.status(400);
        throw new Error("Order is already paid");
    }

    const amount = orderDB.totalPrice * 100;

    const options = { amount, currency: "INR" };
    const order = await instance.orders.create(options);

    res.status(200).json({ success: true, order });
});

const verifyOrderToPaidRazorpay = asyncHandler(async (req, res) => {
    // verify signature
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET).update(body.toString()).digest("hex");

    const authenticPayment = razorpay_signature === expectedSignature;
    if (!authenticPayment) {
        res.status(400);
        throw new Error("Payment verification failed");
    }

    // check if order amount is correct
    const order = await Order.findById(req.params.id);

    if (order) {
        const razorpay = { ...instance };
        const paymentId = razorpay_payment_id;

        let payment = {};
        try {
            payment = await razorpay.payments.fetch(paymentId);
        } catch (err) {
            res.status(400);
            throw new Error("Payment not found");
        }

        const paidCorrectAmount = Number(order.totalPrice).toFixed(2) === ((Number(payment.amount).toFixed(2)) / 100).toFixed(2);
        if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = payment;

        const updatedOrder = await order.save();

        res.status(200).json({ success: true, message: "Payment successful" });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// admin controllers

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});

export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaidPayPal, initializeOrderRazorpay, verifyOrderToPaidRazorpay, updateOrderToDelivered, getAllOrders };