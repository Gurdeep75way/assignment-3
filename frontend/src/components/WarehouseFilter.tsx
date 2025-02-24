import React from "react";

interface WarehouseFilterProps {
    warehouses: string[];
    selected: string;
    onChange: (warehouse: string) => void;
}

const WarehouseFilter: React.FC<WarehouseFilterProps> = ({ warehouses, selected, onChange }) => {
    return (
        <select className="border p-2 rounded-md" value={selected} onChange={(e) => onChange(e.target.value)}>
            <option value="">All Warehouses</option>
            {warehouses.map((warehouse) => (
                <option key={warehouse} value={warehouse}>
                    {warehouse}
                </option>
            ))}
        </select>
    );
};

export default WarehouseFilter;
