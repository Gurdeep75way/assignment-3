import { InventoryItem } from "../types";

const useFilterData = (inventory: InventoryItem[], warehouse: string) => {
    return warehouse ? inventory.filter(item => item.warehouse === warehouse) : inventory;
};

export default useFilterData;
