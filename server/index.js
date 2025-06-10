import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';

import productRoute from './routes/productRoute.js';
import userRoute from './routes/userRoute.js';
import orderRoute from './routes/orderRoute.js';
import uploadRoute from './routes/uploadRoute.js';

import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();
connectDB();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);
app.use('/api/upload', uploadRoute);

app.get('/api/config/paypal', (req, res) => res.json({ clientId: process.env.PAYPAL_CLIENT_ID }));

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/dist')));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html')));
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});