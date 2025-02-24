import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addWarehouse } from "../store/reducers/warehouseSlice";

const NewWarehouseForm: React.FC = () => {
    const [warehouseName, setWarehouseName] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!warehouseName.trim()) return;

        dispatch(addWarehouse(warehouseName));
        setWarehouseName(""); // Reset input field
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <input
                type="text"
                placeholder="Enter warehouse name"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                className="border p-2 rounded-md mr-2"
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Add Warehouse
            </button>
        </form>
    );
};

export default NewWarehouseForm;
