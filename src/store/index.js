import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth-slice";
import gnosisSlice from "./reducers/gnosis-slice";
// import authSlice from "../redux/authSlice";


const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    gnosis: gnosisSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
