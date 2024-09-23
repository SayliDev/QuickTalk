import { configureStore } from "@reduxjs/toolkit";
import toastSlice from "./toastSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    toast: toastSlice,
    user: userSlice,
  },
});

export default store;
