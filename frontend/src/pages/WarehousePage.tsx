import React, { useState } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Box,
    Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import StoreIcon from "@mui/icons-material/Store";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InventoryIcon from "@mui/icons-material/Inventory";
import warehousesData from "../data/warehouseData.json";
import inventoryData from "../data/inventoryData.json";

const WarehousePage: React.FC = () => {
    const [warehouses, setWarehouses] = useState(warehousesData);
    const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newWarehouse, setNewWarehouse] = useState({ name: "", location: "" });

    const handleOpenModal = (warehouse: any) => {
        setSelectedWarehouse(warehouse);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedWarehouse(null);
    };

    const handleDeleteWarehouse = (id: number) => {
        setWarehouses(warehouses.filter((w) => w.id !== id));
    };

    const handleCreateWarehouse = () => {
        if (!newWarehouse.name.trim() || !newWarehouse.location.trim()) return;
        if (warehouses.some((w) => w.name.toLowerCase() === newWarehouse.name.toLowerCase())) {
            alert("Warehouse already exists!");
            return;
        }
        const newId = warehouses.length ? Math.max(...warehouses.map((w) => w.id)) + 1 : 1;
        setWarehouses([...warehouses, { id: newId, name: newWarehouse.name, location: newWarehouse.location }]);
        setNewWarehouse({ name: "", location: "" });
        setIsCreateOpen(false);
    };

    return (
        <Container maxWidth="xl" sx={{ my: 4 }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: "center", marginBottom: "20px" }}
            >
                <Typography variant="h3" fontWeight="bold" sx={{ color: "#003366" }}>
                    📦 Warehouse Management
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "gray" }}>
                    Efficiently manage your warehouses and inventory!
                </Typography>
            </motion.div>

            {/* Create Warehouse Button */}
            <Box display="flex" justifyContent="flex-end" mb={3}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)}>
                    Add Warehouse
                </Button>
            </Box>

            {/* Warehouse Cards with Details */}
            <Grid container spacing={5}>
                {warehouses.map((warehouse) => {
                    const warehouseInventory = inventoryData.filter((item) => item.warehouse === warehouse.name);
                    const totalStock = warehouseInventory.reduce((sum, item) => sum + item.stock, 0);
                    return (
                        <Grid item xs={12} sm={6} md={4} key={warehouse.id}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card
                                    sx={{
                                        background: "#f5f5f5",
                                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "12px",
                                        position: "relative",
                                        height: "100%",
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{ bgcolor: "#003366" }}>
                                                <StoreIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {warehouse.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <LocationOnIcon fontSize="small" sx={{ verticalAlign: "middle" }} />{" "}
                                                    {warehouse.location}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                    <CardContent>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <InventoryIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                                            Total Stock: <b>{totalStock}</b>
                                        </Typography>
                                        <Typography variant="body2">
                                            Items Stored: <b>{warehouseInventory.length}</b>
                                        </Typography>
                                    </CardContent>
                                    <Box display="flex" justifyContent="space-between" p={2}>
                                        <Button variant="outlined" color="primary" onClick={() => handleOpenModal(warehouse)}>
                                            View Details
                                        </Button>
                                        <IconButton color="error" onClick={() => handleDeleteWarehouse(warehouse.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    );
                })}
            </Grid>
            <Box
                sx={{
                    textAlign: "center",
                    mt: 5,
                    py: 2,
                    background: "#f8f9fa",
                    borderRadius: "8px",
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    📦 Built for efficient warehouse management. Optimize your inventory workflow effortlessly!
                </Typography>
            </Box>

            {/* Warehouse Details Modal */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>{selectedWarehouse?.name}</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1">
                        <b>Location:</b> {selectedWarehouse?.location}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Inventory:
                    </Typography>
                    {selectedWarehouse &&
                        inventoryData
                            .filter((item) => item.warehouse === selectedWarehouse.name)
                            .map((item) => (
                                <Typography key={item.id}>
                                    📦 {item.name} - Stock: {item.stock} - Price: ${item.price}
                                </Typography>
                            ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Create Warehouse Dialog */}
            <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Create Warehouse</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Warehouse Name"
                        variant="outlined"
                        value={newWarehouse.name}
                        onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Location"
                        variant="outlined"
                        value={newWarehouse.location}
                        onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateWarehouse}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default WarehousePage;
