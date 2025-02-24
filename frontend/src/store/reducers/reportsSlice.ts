import { createSlice } from "@reduxjs/toolkit";
import inventoryData from "../../data/inventoryData.json";
import warehousesData from "../../data/warehouseData.json";

interface InventoryItem {
    id: number;
    name: string;
    stock: number;
    warehouse: string;
    price: number;
}

interface Warehouse {
    id: number;
    name: string;
    location: string;
}

// Generate Reports with Detailed Data
const generateReports = (inventory: InventoryItem[], warehouses: Warehouse[]) => {
    const categoryMap: {
        [key: string]: {
            totalItems: number;
            totalStock: number;
            totalValue: number;
            priceRange: string;
            warehouse: string;
            products: InventoryItem[];
        };
    } = {};

    inventory.forEach(item => {
        const warehouse = warehouses.find(w => w.name === item.warehouse);
        const category = warehouse ? warehouse.location : "Unknown";

        if (!categoryMap[category]) {
            categoryMap[category] = {
                totalItems: 0,
                totalStock: 0,
                totalValue: 0,
                priceRange: "",
                warehouse: item.warehouse,
                products: [],
            };
        }

        categoryMap[category].totalItems += 1;
        categoryMap[category].totalStock += item.stock;
        categoryMap[category].totalValue += item.price * item.stock;
        categoryMap[category].products.push(item);
    });

    return Object.entries(categoryMap).map(([category, data]) => ({
        category,
        totalItems: data.totalItems,
        totalStock: data.totalStock,
        totalValue: data.totalValue,
        warehouse: data.warehouse,
        priceRange: `₹${Math.min(...inventory.map(i => i.price))} - ₹${Math.max(...inventory.map(i => i.price))}`,
        products: data.products,
    }));
};

const initialState = {
    reports: generateReports(inventoryData, warehousesData),
};

const reportsSlice = createSlice({
    name: "reports",
    initialState,
    reducers: {},
});

export default reportsSlice.reducer;
