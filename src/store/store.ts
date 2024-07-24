import { configureStore } from '@reduxjs/toolkit';
import cartApiSlice from './cartApiSlice';
import loginApiSlice from './accountApiSlice';

const store = configureStore({
    reducer: {
        [cartApiSlice.reducerPath]: cartApiSlice.reducer,
        [loginApiSlice.reducerPath]: loginApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(cartApiSlice.middleware)
            .concat(loginApiSlice.middleware);
    },
});

export default store;
