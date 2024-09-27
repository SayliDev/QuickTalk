import { configureStore } from "@reduxjs/toolkit";
import toastSlice from "./toastSlice";
import userSlice from "./userSlice";
import messageSlice from "./messageSlice";

const store = configureStore({
  reducer: {
    toast: toastSlice,
    user: userSlice,
    message: messageSlice,
  },
});

export default store;
