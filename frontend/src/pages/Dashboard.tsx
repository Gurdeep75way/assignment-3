import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from "chart.js";
import { Box, Typography, Select, MenuItem, Card, Grid } from "@mui/material";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Dashboard: React.FC = () => {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
    const inventory = useSelector((state: any) => state.inventory.items);
    const warehouses = useSelector((state: any) => state.warehouse.locations);

    const filteredInventory = selectedWarehouse
        ? inventory.filter((item: any) => item.warehouse === selectedWarehouse)
        : inventory;

    const warehouseStock = filteredInventory.reduce((acc: Record<string, number>, item: any) => {
        acc[item.warehouse] = (acc[item.warehouse] || 0) + item.stock;
        return acc;
    }, {});

    const chartOptions = { responsive: true, maintainAspectRatio: false };

    const pieChartData = {
        labels: Object.keys(warehouseStock),
        datasets: [
            {
                label: "Stock Distribution",
                data: Object.values(warehouseStock),
                backgroundColor: ["#1E3A8A", "#E11D48", "#22C55E", "#FACC15", "#9333EA"],
                borderColor: "#000",
                borderWidth: 1.5,
            },
        ],
    };

    const barChartData = {
        labels: Object.keys(warehouseStock),
        datasets: [
            {
                label: "Total Stock",
                data: Object.values(warehouseStock),
                backgroundColor: "#6366F1",
                borderColor: "#000",
                borderWidth: 1.5,
            },
        ],
    };

    const lineChartData = {
        labels: Object.keys(warehouseStock),
        datasets: [
            {
                label: "Inventory Over Time",
                data: Object.values(warehouseStock),
                borderColor: "#E11D48",
                backgroundColor: "rgba(225, 29, 72, 0.2)",
                fill: true,
                borderWidth: 2,
            },
        ],
    };

    return (
        <Box sx={{ p: 4, backgroundColor: "#fff", minHeight: "100vh" }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center" color="text.primary">
                    📊 Warehouse Inventory Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" textAlign="center" mb={4}>
                    Track stock levels, warehouse distribution, and trends.
                </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <Card sx={{ mb: 4, p: 2, maxWidth: "400px", mx: "auto", boxShadow: 3 }}>
                    <Typography variant="h6" fontWeight="bold" mb={1} color="text.primary">
                        Select Warehouse:
                    </Typography>
                    <Select
                        fullWidth
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                        displayEmpty
                        sx={{ bgcolor: "#f1f5f9", color: "#000", borderRadius: 1 }}
                    >
                        <MenuItem value="">All Warehouses</MenuItem>
                        {warehouses.map((warehouse: string) => (
                            <MenuItem key={warehouse} value={warehouse}>
                                {warehouse}
                            </MenuItem>
                        ))}
                    </Select>
                </Card>
            </motion.div>

            <Grid container spacing={3} justifyContent="center">
                {/* Pie Chart */}
                <Grid item xs={12} md={6} lg={4}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Card sx={{ p: 3, height: "350px", boxShadow: 3, bgcolor: "#f9fafb" }}>
                            <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center" color="text.primary">
                                Stock Distribution
                            </Typography>
                            <Box sx={{ height: "250px" }}>
                                <Pie data={pieChartData} options={chartOptions} />
                            </Box>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Bar Chart */}
                <Grid item xs={12} md={6} lg={4}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <Card sx={{ p: 3, height: "350px", boxShadow: 3, bgcolor: "#f9fafb" }}>
                            <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center" color="text.primary">
                                Total Stock per Warehouse
                            </Typography>
                            <Box sx={{ height: "250px" }}>
                                <Bar data={barChartData} options={chartOptions} />
                            </Box>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Line Chart */}
                <Grid item xs={12} lg={8}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <Card sx={{ p: 3, height: "400px", boxShadow: 3, bgcolor: "#f9fafb" }}>
                            <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center" color="text.primary">
                                Inventory Trend Over Time
                            </Typography>
                            <Box sx={{ height: "300px" }}>
                                <Line data={lineChartData} options={chartOptions} />
                            </Box>
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
