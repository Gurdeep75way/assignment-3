import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { removeItem, updateItem } from "../store/reducers/inventorySlice";
import { Modal, Box, Typography, TextField, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";

interface InventoryModalProps {
    item: any;
    onClose: () => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ item, onClose }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [editedItem, setEditedItem] = useState({ ...item });

    const handleUpdate = () => {
        dispatch(updateItem(editedItem));
        onClose();
    };

    return (
        <Modal open onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Keeps it centered
                    width: { xs: "95vw", sm: "400px" }, // Responsive width
                    maxWidth: "400px", // Ensures it doesn't stretch too much
                    bgcolor: "background.paper",
                    borderRadius: "10px",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Typography variant="h6" mb={2} color={theme.palette.primary.main}>
                        Edit Inventory Item
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Item Name"
                            value={editedItem.name}
                            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Price"
                            type="number"
                            value={editedItem.price}
                            onChange={(e) => setEditedItem({ ...editedItem, price: parseFloat(e.target.value) })}
                            fullWidth
                        />
                        <TextField
                            label="Stock"
                            type="number"
                            value={editedItem.stock}
                            onChange={(e) => setEditedItem({ ...editedItem, stock: parseInt(e.target.value, 10) })}
                            fullWidth
                        />
                        <TextField
                            label="Warehouse"
                            value={editedItem.warehouse}
                            onChange={(e) => setEditedItem({ ...editedItem, warehouse: e.target.value })}
                            fullWidth
                        />

                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button variant="contained" color="primary" onClick={handleUpdate}>
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    dispatch(removeItem(item.id));
                                    onClose();
                                }}
                            >
                                Delete
                            </Button>
                        </Stack>
                    </Stack>
                </motion.div>
            </Box>
        </Modal>

    );
};

export default InventoryModal;
