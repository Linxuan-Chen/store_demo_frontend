import { configureStore } from '@reduxjs/toolkit';
import cartApiSlice from './cartApiSlice';

const store = configureStore({
    reducer: {
        [cartApiSlice.reducerPath]: cartApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(cartApiSlice.middleware);
    },
});

export default store;
