import React from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from 'react-router-dom';
import Cart from '../pages/cart/Cart';
import Homepage from '../pages/homepage/Homepage';
import Layout from '../pages/layout/Layout';
import Login from '../pages/login/Login';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path='/' element={<Homepage />} />
            <Route path='/cart/:cart_id/' element={<Cart />} />
            <Route path='/login/' element={<Login />} />
        </Route>
    )
);

export default router;
