import { combineReducers, configureStore } from "@reduxjs/toolkit"
import authReducer from "./Slice/authSlice"
import dataReducer from "./Slice/dataSlice"
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const reducer = combineReducers({
    auth: authReducer,
    data: dataReducer
})

const persistConfig = {
    key: "root",
    storage
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'], 
            },
        }),
})


export default store