import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: (() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from local storage:", error);
      return null;
    }
  })(),
  loading: false,
    socketConnection:null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignupData: (state, action) => {
      state.signupData = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logOut: (state) => {
      state.signupData = null;
      localStorage.removeItem("user");
       state.socketConnection=null
    },
    setSocketConnection:(state,action)=>{
      state.socketConnection=action.payload
    }
  }
});

export const { setSignupData, setLoading, logOut,setSocketConnection } = authSlice.actions;
export default authSlice.reducer;
