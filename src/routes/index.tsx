import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Cart from '../pages/cart/Cart';
import Homepage from '../pages/homepage/Homepage';
import Layout from '../pages/layout/Layout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path='/' element={<Homepage />} />
      <Route path='cart' element={<Cart />} />
    </Route>
  )
);

export default router;
