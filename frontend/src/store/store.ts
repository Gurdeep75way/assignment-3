import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/authReducer";
import { api } from "../services/api";
import inventoryReducer from "./reducers/inventorySlice";
import warehouseReducer from "./reducers/warehouseSlice";
import alertsReducer from "./reducers/alertsSlice";
import reportsReducer from "./reducers/reportsSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    warehouse: warehouseReducer,
    alerts: alertsReducer,
    reports: reportsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
