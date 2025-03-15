import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.js";
import cartSlice from "./slices/cartSlice.js";
import productSlice from "./slices/productSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    product: productSlice,
  },
});
