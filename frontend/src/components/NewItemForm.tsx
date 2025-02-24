import React from "react";
import { Modal, Box, TextField, Button, Typography, Backdrop, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { addItem } from "../store/reducers/inventorySlice";

interface AddItemModalProps {
    open: boolean;
    onClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const [newItem, setNewItem] = React.useState({
        name: "",
        stock: "",
        warehouse: "",
        price: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.name || !newItem.stock || !newItem.warehouse || !newItem.price) return;

        dispatch(addItem({
            id: Date.now(),
            name: newItem.name,
            stock: parseInt(newItem.stock),
            warehouse: newItem.warehouse,
            price: parseFloat(newItem.price),
        }));

        setNewItem({ name: "", stock: "", warehouse: "", price: "" });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 300 }}>
            <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 0, opacity: 0 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 420,
                        bgcolor: "rgba(255, 255, 255, 0.9)", // Clean white background
                        backdropFilter: "blur(20px)", // Glassmorphism effect
                        borderRadius: 6,
                        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)", // Soft shadow
                        border: "1px solid rgba(0, 0, 0, 0.1)", // Subtle border
                        p: 4,
                    }}
                >
                    {/* Close Button */}
                    <IconButton onClick={onClose} sx={{ position: "absolute", top: 10, right: 10, color: "#333" }}>
                        <CloseIcon />
                    </IconButton>

                    {/* Title */}
                    <Typography variant="h5" fontWeight="bold" align="center" sx={{ color: "#333", mb: 2 }}>
                        Add New Item
                    </Typography>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Item Name"
                            name="name"
                            value={newItem.name}
                            onChange={handleChange}
                            required
                            sx={{
                                mb: 2,
                                "& label": { color: "#333" },
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: "rgba(255, 255, 255, 0.6)",
                                    borderRadius: 2,
                                    "& fieldset": { borderColor: "#ccc" },
                                    "&:hover fieldset": { borderColor: "#333" },
                                    "&.Mui-focused fieldset": { borderColor: "#6A1B9A" },
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Stock"
                            name="stock"
                            type="number"
                            value={newItem.stock}
                            onChange={handleChange}
                            required
                            sx={{
                                mb: 2,
                                "& label": { color: "#333" },
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: "rgba(255, 255, 255, 0.6)",
                                    borderRadius: 2,
                                    "& fieldset": { borderColor: "#ccc" },
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Warehouse"
                            name="warehouse"
                            value={newItem.warehouse}
                            onChange={handleChange}
                            required
                            sx={{
                                mb: 2,
                                "& label": { color: "#333" },
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: "rgba(255, 255, 255, 0.6)",
                                    borderRadius: 2,
                                    "& fieldset": { borderColor: "#ccc" },
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            value={newItem.price}
                            onChange={handleChange}
                            required
                            sx={{
                                mb: 3,
                                "& label": { color: "#333" },
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: "rgba(255, 255, 255, 0.6)",
                                    borderRadius: 2,
                                    "& fieldset": { borderColor: "#ccc" },
                                },
                            }}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                bgcolor: "#6A1B9A",
                                color: "#fff",
                                borderRadius: 3,
                                fontSize: "1rem",
                                textTransform: "none",
                                transition: "0.3s",
                                "&:hover": { bgcolor: "#4A148C", transform: "scale(1.05)" },
                            }}
                        >
                            Add Item
                        </Button>
                    </form>
                </Box>
            </motion.div>
        </Modal>
    );
};

export default AddItemModal;
