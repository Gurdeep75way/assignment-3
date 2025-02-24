import { useState, useEffect } from "react";
import mockInventory from "../data/inventoryData.json";
import { InventoryItem } from "../types";


const useFetchInventory = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Simulating API delay
        setTimeout(() => {
            setInventory(mockInventory);
            setLoading(false);
        }, 1000);
    }, []);

    return { inventory, loading };
};

export default useFetchInventory;
