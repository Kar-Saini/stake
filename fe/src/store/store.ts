import userDataReducer from "./slice/userDataSlice";

import { configureStore } from "@reduxjs/toolkit";
const store = configureStore({
  reducer: {
    userData: userDataReducer,
  },
});
export default store;
