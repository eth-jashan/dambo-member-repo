import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth-slice";
import contributorSlice from "./reducers/contributor-slice";
import gnosisSlice from "./reducers/gnosis-slice";
// import authSlice from "../redux/authSlice";
import { persistStore, persistReducer,createTransform, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import Flatted from "flatted";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

// export const transformCircular = createTransform(
//   (inboundState, key) => Flatted.stringify(inboundState),
//   (outboundState, key) => Flatted.parse(outboundState),
// )

const persistConfig = {
  key: "root",
  storage,
  // transforms: [transformCircular],
  // stateReconciler: autoMergeLevel2
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  gnosis: gnosisSlice.reducer,
  contributor:contributorSlice.reducer
})

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ 
      // serializableCheck:  {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // }
      serializableCheck: false
    }),
});

// export const persistor = persistStore(store);
export default store;
