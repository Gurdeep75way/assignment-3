import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from "@mui/material";
import { motion } from "framer-motion";
import InventoryModal from "./InventoryModal";
import { InventoryItem } from "../types";

// Custom theme with high contrast (Dark Blue #003366)
const customTheme = createTheme({
    palette: {
        primary: {
            main: "#003366",
            contrastText: "#ffffff",
        },
        background: {
            default: "#F6F6F9",
            paper: "#ffffff",
        },
        text: {
            primary: "#222222",
            secondary: "#555555",
        },
    },
});

interface InventoryTableProps {
    inventory: InventoryItem[];
}

const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.04, duration: 0.3 },
    }),
};

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    const handlePageChange = (_: any, newPage: number) => setPage(newPage);
    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    return (
        <ThemeProvider theme={customTheme}>
            <motion.div initial="hidden" animate="visible" transition={{ duration: 0.6 }}>
                <TableContainer
                    component={Paper}
                    elevation={6}
                    sx={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Table>
                        {/* Table Head */}
                        <TableHead>
                            <TableRow sx={{ backgroundColor: customTheme.palette.primary.main }}>
                                {["Item Name", "Price", "Stock", "Warehouse"].map((header, index) => (
                                    <TableCell
                                        key={index}
                                        sx={{
                                            color: customTheme.palette.primary.contrastText,
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            textAlign: "left",
                                            padding: "12px",
                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                            {inventory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    custom={index}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                    style={{
                                        cursor: "pointer",
                                        transition: "0.3s",
                                        backgroundColor: "#ffffff",
                                    }}
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <TableCell
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            color: "#222",
                                            padding: "12px",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        {item.name}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            color: "#003366",
                                            padding: "12px",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        ${item.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            color: "#222",
                                            padding: "12px",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        {item.stock}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            color: "#222",
                                            padding: "12px",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        {item.warehouse}
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={inventory.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        sx={{
                            backgroundColor: customTheme.palette.background.paper,
                            color: customTheme.palette.text.primary,
                            fontWeight: "bold",
                        }}
                    />
                </TableContainer>

                {/* Modal for Item Details */}
                {selectedItem && <InventoryModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
            </motion.div>
        </ThemeProvider>
    );
};

export default InventoryTable;
