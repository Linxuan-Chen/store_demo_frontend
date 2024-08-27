import { configureStore } from '@reduxjs/toolkit';
import cartApiSlice from './cartApiSlice';
import loginApiSlice from './accountApiSlice';
import collectionApiSlice from './collectionApiSlice';
import addressApiSlice from './addressApiSlice';
import customerApiSlice from './customerApiSlice';
import orderApiSlice from './orderApiSlice';
import productApiSlice from './productApiSlice';
import rootReducer from './rootReducer';

const store = configureStore({
    reducer: rootReducer,
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
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
