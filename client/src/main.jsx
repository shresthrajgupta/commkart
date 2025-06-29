import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import store from './redux/store.js';

import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';

import App from './App.jsx';

import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ShippingPage from './pages/ShippingPage.jsx';
import PaymentMethodPage from './pages/PaymentMethodPage.jsx';
import PlaceOrderPage from './pages/PlaceOrderPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import OrderListPage from './pages/OrderListPage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';
import ProductEditPage from './pages/ProductEditPage.jsx';
import UserListPage from './pages/UserListPage.jsx';
import UserEditPage from './pages/UserEditPage.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path='/' element={<HomePage />} />
      <Route path='/search/:keyword' element={<HomePage />} />
      <Route path='/page/:pageNumber' element={<HomePage />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<HomePage />} />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/forgotpassword' element={<ForgotPassword />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingPage />} />
        <Route path='/payment' element={<PaymentMethodPage />} />
        <Route path='/placeorder' element={<PlaceOrderPage />} />
        <Route path='/order/:id' element={<OrderPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Route>

      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/orderlist' element={<OrderListPage />} />
        <Route path='/admin/productlist' element={<ProductListPage />} />
        <Route path='/admin/productlist/:pageNumber' element={<ProductListPage />} />
        <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
        <Route path='/admin/userlist' element={<UserListPage />} />
        <Route path='/admin/user/:id/edit' element={<UserEditPage />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </StrictMode>,
);
