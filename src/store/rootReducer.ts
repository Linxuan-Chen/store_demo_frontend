import cartApiSlice from './cartApiSlice';
import loginApiSlice from './accountApiSlice';
import collectionApiSlice from './collectionApiSlice';
import addressApiSlice from './addressApiSlice';
import customerApiSlice from './customerApiSlice';
import orderApiSlice from './orderApiSlice';
import productApiSlice from './productApiSlice';
import cartSlice from './cartSlice';
import { combineReducers } from '@reduxjs/toolkit';

const appReducer = combineReducers({
    [cartApiSlice.reducerPath]: cartApiSlice.reducer,
    [loginApiSlice.reducerPath]: loginApiSlice.reducer,
    [collectionApiSlice.reducerPath]: collectionApiSlice.reducer,
    [addressApiSlice.reducerPath]: addressApiSlice.reducer,
    [customerApiSlice.reducerPath]: customerApiSlice.reducer,
    [orderApiSlice.reducerPath]: orderApiSlice.reducer,
    [productApiSlice.reducerPath]: productApiSlice.reducer,
    [cartSlice.reducerPath]: cartSlice.reducer,
});

export type RootState = ReturnType<typeof appReducer>;

interface ResetStateAction {
    [index: string]: string;
    type: 'RESET_STORE';
}

const rootReducer = (state: RootState | undefined, action: ResetStateAction) => {
    if (action.type === 'RESET_STORE') {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

export default rootReducer;
