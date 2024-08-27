import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart_id: localStorage.getItem('cart_id') || '',
    },
    reducers: {
        setCartId: (state, action) => {
            state.cart_id = action.payload;
        },
    },
    reducerPath: 'cart',
});

export const { setCartId } = cartSlice.actions;
export default cartSlice;
