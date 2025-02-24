import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery, setSort } from "../store/reducers/inventorySlice";
import { TextField, Button, Stack, Box } from "@mui/material";
import { motion } from "framer-motion";
import { debounce } from "lodash";

const InventoryControls: React.FC = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");

    // Debounce search function
    const handleSearch = useCallback(
        debounce((query) => dispatch(setSearchQuery(query)), 300),
        []
    );

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            <Box
                sx={{
                    p: 3,
                    borderRadius: "12px",
                }}
            >
                <Stack spacing={2} alignItems="center" mb={3}>
                    <TextField
                        fullWidth
                        label="Search items..."
                        value={search}
                        onChange={onSearchChange}
                        variant="outlined"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                "&:hover fieldset": { borderColor: "#003366" },
                                "&.Mui-focused fieldset": { borderColor: "#003366" },
                            },
                            "& label.Mui-focused": { color: "#003366" },
                        }}
                    />

                    {/* Sorting Buttons */}
                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                        {[
                            { label: "Sort Name ▲", sortBy: "name", order: "asc" },
                            { label: "Sort Name ▼", sortBy: "name", order: "desc" },
                            { label: "Sort Stock ▲", sortBy: "stock", order: "asc" },
                            { label: "Sort Stock ▼", sortBy: "stock", order: "desc" },
                        ].map(({ label, sortBy, order }) => (
                            <Button
                                key={label}
                                variant="contained"
                                onClick={() => dispatch(setSort({ sortBy, sortOrder: order }))}
                                sx={{
                                    bgcolor: "#003366",
                                    color: "#fff",
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    "&:hover": { bgcolor: "#002244" },
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </motion.div>
    );
};

export default InventoryControls;
