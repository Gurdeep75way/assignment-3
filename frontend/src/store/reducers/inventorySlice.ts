import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";
import inventoryData from "../../data/inventoryData.json";
import { InventoryItem } from "../../types";

interface InventoryState {
    items: InventoryItem[];
    searchQuery: string;
    sortBy: "name" | "stock" | null;
    sortOrder: "asc" | "desc";
}

const initialState: InventoryState = {
    items: inventoryData,
    searchQuery: "",
    sortBy: null,
    sortOrder: "asc",
};

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<InventoryItem>) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        updateItem: (state, action: PayloadAction<InventoryItem>) => {
            return produce(state, draft => {
                const index = draft.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) draft.items[index] = action.payload;
            });
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setSort: (state, action: PayloadAction<{ sortBy: "name" | "stock"; sortOrder: "asc" | "desc" }>) => {
            state.sortBy = action.payload.sortBy;
            state.sortOrder = action.payload.sortOrder;

            state.items.sort((a, b) => {
                const valueA = action.payload.sortBy === "name" ? a.name.toLowerCase() : a.stock;
                const valueB = action.payload.sortBy === "name" ? b.name.toLowerCase() : b.stock;

                return action.payload.sortOrder === "asc"
                    ? valueA > valueB ? 1 : -1
                    : valueA < valueB ? 1 : -1;
            });
        },
    },
});

export const { addItem, removeItem, updateItem, setSearchQuery, setSort } = inventorySlice.actions;
export default inventorySlice.reducer;
