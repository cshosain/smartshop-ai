import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:     [],
    isOpen:    false,  // controls CartDrawer visibility
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) {
        // Product already in cart — just increase quantity
        existing.quantity += 1;
      } else {
        // New product — add with quantity 1
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item) {
        if (quantity <= 0) {
          // Remove if quantity reaches zero
          state.items = state.items.filter(i => i._id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },

    clearCart:   (state) => { state.items = []; },
    openCart:    (state) => { state.isOpen = true; },
    closeCart:   (state) => { state.isOpen = false; },
    toggleCart:  (state) => { state.isOpen = !state.isOpen; },
  },
});

export const {
  addToCart, removeFromCart, updateQuantity,
  clearCart, openCart, closeCart, toggleCart,
} = cartSlice.actions;

// ── Selectors — computed values derived from state ──
export const selectCartItems     = (state) => state.cart.items;
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal     = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartIsOpen    = (state) => state.cart.isOpen;

export default cartSlice.reducer;