import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from 'react-router-dom';
import Cart from '../pages/cart/Cart';
import Homepage from '../pages/homepage/Homepage';
import Layout from '../pages/layout/Layout';
import Login from '../pages/login/Login';
import SignUp from '../pages/signup/SignUp';
import Checkout from '../pages/checkout/Checkout';
import Account from '../pages/account/Account';
import Address from '../pages/account/Address';
import Orders from '../pages/account/Orders';
import Profile from '../pages/account/Profile';
import AccountRouter from '../pages/account/AccountRouter';
import ProductDetails from '../pages/product/ProductDetails';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path='/' element={<Homepage />} />
            <Route path='/checkout/:cart_id' element={<Checkout />} />
            <Route path='/cart/:cart_id' element={<Cart />} />
            <Route path='/login/' element={<Login />} />
            <Route path='/sign-up/' element={<SignUp />} />
            <Route path='/my-account/' element={<AccountRouter />}>
                <Route index element={<Account />} />
                <Route path='orders/' element={<Orders />} />
                <Route path='profile/' element={<Profile />} />
                <Route path='address/' element={<Address />} />
            </Route>
            <Route
                path='/product/:product_id/:slug?'
                element={<ProductDetails />}
            />
        </Route>
    )
);

export default router;
