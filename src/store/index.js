import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth-slice";
import contributorSlice from "./reducers/contributor-slice";
import gnosisSlice from "./reducers/gnosis-slice";
// import authSlice from "../redux/authSlice";
import { persistStore, persistReducer,createTransform, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import thunk from 'redux-thunk'
import JSOG from 'jsog'
import web3Slice from "./reducers/web3-slice";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  gnosis: gnosisSlice.reducer,
  contributor:contributorSlice.reducer,
  web3:web3Slice.reducer
})

const persistConfig = {
  key: "root",
  storage,
  blacklist:['web3']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware:[thunk]
});

export const persistor = persistStore(store);
export default store;
