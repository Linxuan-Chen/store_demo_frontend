import { configureStore } from '@reduxjs/toolkit';
import cartApiSlice from './cartApiSlice';
import loginApiSlice from './accountApiSlice';
import collectionApiSlice from './collectionApiSlice';
import addressApiSlice from './addressApiSlice';
import customerApiSlice from './customerApiSlice';
import orderApiSlice from './orderApiSlice';
import productApiSlice from './productApiSlice';

const store = configureStore({
    reducer: {
        [cartApiSlice.reducerPath]: cartApiSlice.reducer,
        [loginApiSlice.reducerPath]: loginApiSlice.reducer,
        [collectionApiSlice.reducerPath]: collectionApiSlice.reducer,
        [addressApiSlice.reducerPath]: addressApiSlice.reducer,
        [customerApiSlice.reducerPath]: customerApiSlice.reducer,
        [orderApiSlice.reducerPath]: orderApiSlice.reducer,
        [productApiSlice.reducerPath]: productApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(cartApiSlice.middleware)
            .concat(loginApiSlice.middleware)
            .concat(collectionApiSlice.middleware)
            .concat(addressApiSlice.middleware)
            .concat(customerApiSlice.middleware)
            .concat(orderApiSlice.middleware)
            .concat(productApiSlice.middleware);
    },
});

export default store;
