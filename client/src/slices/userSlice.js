import { createSlice } from "@reduxjs/toolkit";

const initialState={
    onlineUser:[],
}


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  setOnlineUser:(state,action)=>{
 state.onlineUser=action.payload
  }
  }
});

export const { setOnlineUser} = userSlice.actions;
export default userSlice.reducer;
