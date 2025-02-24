import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import warehouseData from "../../data/warehouseData.json";

interface WarehouseState {
    locations: string[];
}

const initialState: WarehouseState = {
    locations: warehouseData.map((w) => w.name), // Store warehouse names
};

const warehouseSlice = createSlice({
    name: "warehouse",
    initialState,
    reducers: {
        addWarehouse: (state, action: PayloadAction<string>) => {
            if (!state.locations.includes(action.payload)) {
                state.locations.push(action.payload);
            }
        },
    },
});

export const { addWarehouse } = warehouseSlice.actions;
export default warehouseSlice.reducer;
