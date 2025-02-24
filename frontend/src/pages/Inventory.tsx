import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import InventoryTable from "../components/InventoryTable";
import InventoryControls from "../components/InventoryControls";
import AddItemModal from "../components/NewItemForm";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";

const Inventory: React.FC = () => {
    const { items, searchQuery } = useSelector((state: any) => state.inventory);
    const [openModal, setOpenModal] = useState(false);

    const filteredInventory = items.filter((item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 3 }}>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: "center", marginBottom: "20px" }}
            >
                <Typography variant="h3" fontWeight="bold" sx={{ color: "#003366" }}>
                    📦 Inventory Management
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "gray" }}>
                    Efficiently manage your Inventory and warehouses!
                </Typography>
                <Box mb={3} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        onClick={() => setOpenModal(true)}
                        startIcon={<AddIcon />}
                    >
                        + Add New Item
                    </Button>
                </Box>
                <InventoryControls />
                <InventoryTable inventory={filteredInventory} />
            </motion.div>


            {/* Create Warehouse Button */}


            {/* Add Item Modal */}
            <AddItemModal open={openModal} onClose={() => setOpenModal(false)} />
        </Container>
    );
};

export default Inventory;
