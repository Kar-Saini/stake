import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    name: "",
    email: "",
    role: "",
    balance: 0,
  },
  reducers: {
    addData: (state, action) => {
      state.email = action.payload.email;
      state.balance = action.payload.balance;
      state.role = action.payload.role;
      state.name = action.payload.name;
    },
  },
});

export default userDataSlice.reducer;
export const { addData } = userDataSlice.actions;
