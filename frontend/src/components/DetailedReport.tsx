import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

interface DetailedReportProps {
    open: boolean;
    onClose: () => void;
    report: any; // Report data with detailed products
}

const DetailedReport: React.FC<DetailedReportProps> = ({ open, onClose, report }) => {
    if (!report) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: "12px",
                    background: "#FFFFFF", // White background
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
                    padding: "16px",
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    m: 1.5,
                    mb: 3,
                    fontWeight: "600",
                    fontSize: "25px",
                    background: "#471769", // Deep Royal Purple
                    color: "#FFFFFF",
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "12px",
                }}
            >
                📊 Detailed Report - {report.category}
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: "#FFFFFF",
                        "&:hover": { color: "#F0F0F0", backgroundColor: "rgba(255, 255, 255, 0.1)" },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* Content */}
            <DialogContent sx={{ padding: "24px" }}>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 2,
                        fontSize: "17px",
                        fontWeight: "500",
                        color: "#333333",
                    }}
                >
                    <strong>🏬 Warehouse:</strong> {report.warehouse}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mb: 3,
                        fontSize: "17px",
                        fontWeight: "500",
                        color: "#333333",
                    }}
                >
                    <strong>💰 Total Value:</strong> ₹{report.totalValue.toLocaleString()}
                </Typography>

                {/* Table */}
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: "8px",
                        background: "#FFFFFF",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                        overflow: "hidden",
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ background: "#471769" }}>
                                <TableCell sx={{ color: "#FFFFFF", fontWeight: "600", fontSize: "16px", padding: "14px" }}>
                                    🛒 Product
                                </TableCell>
                                <TableCell sx={{ color: "#FFFFFF", fontWeight: "600", fontSize: "16px", padding: "14px" }}>
                                    📦 Stock
                                </TableCell>
                                <TableCell sx={{ color: "#FFFFFF", fontWeight: "600", fontSize: "16px", padding: "14px" }}>
                                    💲 Price
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {report.products.map((product: any, index: number) => (
                                <TableRow
                                    key={index}
                                    component={motion.tr}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "#F6F6F9" : "#FFFFFF", // Subtle contrast
                                        "&:hover": { backgroundColor: "#EDEDED" },
                                        transition: "background-color 0.3s ease-in-out",
                                    }}
                                >
                                    <TableCell sx={{ fontSize: "16px", fontWeight: "500", padding: "14px" }}>
                                        {product.name}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "16px", fontWeight: "500", padding: "14px" }}>
                                        {product.stock}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "16px", fontWeight: "600", color: "#2D004D", padding: "14px" }}>
                                        ₹{product.price}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
};

export default DetailedReport;
