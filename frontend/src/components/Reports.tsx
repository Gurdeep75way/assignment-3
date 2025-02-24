import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Select,
    InputAdornment,
    Button,
    Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import DetailedReport from "./DetailedReport";
import { CSVLink } from "react-csv";

const Reports: React.FC = () => {
    const reportData = useSelector((state: RootState) => state.reports.reports);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [sortBy, setSortBy] = useState<"totalValue" | "totalStock" | "totalItems">("totalValue");

    const handleRowClick = (report: any) => {
        setSelectedReport(report);
        setOpen(true);
    };

    // Filter reports based on search & category
    const filteredReports = reportData
        .filter(report => report.category.toLowerCase().includes(search.toLowerCase()))
        .filter(report => (filterCategory ? report.category === filterCategory : true))
        .sort((a, b) => b[sortBy] - a[sortBy]); // Sorting logic

    return (
        <>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    maxWidth: "1200px",
                    margin: "auto",
                }}
            >
                <Typography variant="h5" fontWeight="bold" color="#003366" mb={3}>
                    📊 Inventory Reports
                </Typography>

                {/* Search & Filter Options */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    mb={3}
                    alignItems={{ xs: "stretch", sm: "center" }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Search by category"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        sx={{
                            flex: 1,
                            minWidth: "200px",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                "& fieldset": { borderColor: "#003366" },
                                "&:hover fieldset": { borderColor: "#0055A4" },
                                "&.Mui-focused fieldset": { borderColor: "#0077CC" },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#003366" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        displayEmpty
                        sx={{
                            minWidth: 180,
                            backgroundColor: "white",
                            borderRadius: 1,
                            borderColor: "#003366",
                            "&:hover": { borderColor: "#0055A4" },
                        }}
                    >
                        <MenuItem value="">All Categories</MenuItem>
                        {[...new Set(reportData.map(report => report.category))].map((cat, index) => (
                            <MenuItem key={index} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as any)}
                        sx={{ minWidth: 180, color: "#003366" }}
                    >
                        <MenuItem value="totalValue">Sort by Value</MenuItem>
                        <MenuItem value="totalStock">Sort by Stock</MenuItem>
                        <MenuItem value="totalItems">Sort by Items</MenuItem>
                    </Select>
                    <Button
                        variant="contained"
                        sx={{
                            minWidth: 180,
                            backgroundColor: "#003366",
                            "&:hover": { backgroundColor: "#0055A4" },
                        }}
                    >
                        <CSVLink
                            data={filteredReports}
                            filename="Inventory_Report.csv"
                            style={{ color: "white", textDecoration: "none" }}
                        >
                            📥 Download CSV
                        </CSVLink>
                    </Button>
                </Stack>

                {/* Report Table */}
                {filteredReports.length > 0 ? (
                    <TableContainer
                        component={Paper}
                        sx={{
                            borderRadius: 2,
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#003366" }}>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total Items</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total Stock</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredReports.map((report, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            cursor: "pointer",
                                            "&:hover": { backgroundColor: "#CCE5FF" },
                                            transition: "background-color 0.2s ease-in-out",
                                        }}
                                        onClick={() => handleRowClick(report)}
                                        component={motion.tr}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <TableCell>{report.category}</TableCell>
                                        <TableCell>{report.totalItems}</TableCell>
                                        <TableCell>{report.totalStock}</TableCell>
                                        <TableCell>
                                            <Typography fontWeight="bold" color="#003366">
                                                ₹{report.totalValue.toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography color="textSecondary" sx={{ textAlign: "center", mt: 3, fontSize: "18px" }}>
                        No reports available 📉
                    </Typography>
                )}
            </Paper>

            {/* Detailed Report Modal */}
            <DetailedReport open={open} onClose={() => setOpen(false)} report={selectedReport} />
        </>
    );
};

export default Reports;
