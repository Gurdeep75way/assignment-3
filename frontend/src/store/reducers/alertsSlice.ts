import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    alerts: [], // Stores alerts
    inventory: [
        { id: 1, name: "Laptop", stock: 10 },
        { id: 2, name: "Keyboard", stock: 20 },
        { id: 3, name: "Mouse", stock: 3 }, // Critical low stock
    ],
    warehouse: [
        { id: 1, location: "WH-A", issue: "Power Failure" },
        { id: 2, location: "WH-B", issue: null },
    ],
    reports: [
        { id: 1, item: "Monitor", missing: 5 }, // Stock mismatch
    ],
};

const alertsSlice = createSlice({
    name: "alerts",
    initialState,
    reducers: {
        addAlert: (state, action) => {
            state.alerts.push(action.payload);
        },
    },
});

export const { addAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
