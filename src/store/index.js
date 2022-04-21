import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./reducers/auth-slice"
import contributorSlice from "./reducers/contributor-slice"
import gnosisSlice from "./reducers/gnosis-slice"
// import authSlice from "../redux/authSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "redux"
import web3Slice from "./reducers/web3-slice"
import daoSlice from "./reducers/dao-slice"
import transactionSlice from "./reducers/transaction-slice"
import toastSlice from "./reducers/toast-slice"

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    gnosis: gnosisSlice.reducer,
    contributor: contributorSlice.reducer,
    web3: web3Slice.reducer,
    dao: daoSlice.reducer,
    transaction: transactionSlice.reducer,
    toast: toastSlice.reducer,
})

const persistConfig = {
    key: "root",
    storage,
    blacklist: ["transaction", "web3", "dao", "gnosis", "contributor", "toast"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
})

export const persistor = persistStore(store)
export default store
