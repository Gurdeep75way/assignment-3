import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addAlert } from "../store/reducers/alertsSlice";
import { Box, Typography, Card, CardContent, Container, Grid, Paper, Divider } from "@mui/material";
import { motion } from "framer-motion";

const StockAlertPage = () => {
    const dispatch = useDispatch();
    const alerts = useSelector((state: any) => state.alerts.alerts);
    const inventory = useSelector((state: any) => state.alerts.inventory);
    const warehouse = useSelector((state: any) => state.alerts.warehouse);
    const reports = useSelector((state: any) => state.alerts.reports);

    useEffect(() => {
        let newAlerts = [];

        inventory.forEach((item) => {
            if (item.stock < 15 && !alerts.some((alert) => alert.id === `stock-${item.id}`)) {
                newAlerts.push({
                    id: `stock-${item.id}`,
                    name: item.name,
                    stock: item.stock,
                    check: item.stock <= 5 ? "🔴 Critical Low Stock" : "🟠 Low Stock",
                });
            }
        });

        warehouse.forEach((entry) => {
            if (entry.issue && !alerts.some((alert) => alert.id === `warehouse-${entry.id}`)) {
                newAlerts.push({
                    id: `warehouse-${entry.id}`,
                    name: entry.location,
                    issue: entry.issue,
                    check: "⚠️ Warehouse Issue",
                });
            }
        });

        reports.forEach((report) => {
            if (report.missing > 0 && !alerts.some((alert) => alert.id === `report-${report.id}`)) {
                newAlerts.push({
                    id: `report-${report.id}`,
                    name: report.item,
                    missing: report.missing,
                    check: "⚠️ Stock Mismatch",
                });
            }
        });

        newAlerts.forEach((alert) => dispatch(addAlert(alert)));
    }, [dispatch, inventory, warehouse, reports, alerts]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
            }}
        >
            {/* Page Title */}
            <Paper
                elevation={3}
                sx={{
                    background: "rgba(255, 255, 255, 0.95)",
                    padding: "25px",
                    borderRadius: "12px",
                    textAlign: "center",
                    width: "80%",
                    maxWidth: "900px",
                    mb: 3,
                    borderBottom: "5px solid #0077b6",
                }}
            >
                <Typography variant="h4" fontWeight="bold" sx={{ color: "#1A1A1A", mb: 1 }}>
                    ⚠️ System Warnings & Alerts
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", color: "#444" }}>
                    Efficient inventory tracking prevents supply chain disruptions. Monitor your stock levels,
                    warehouse conditions, and report discrepancies in real-time.
                </Typography>
            </Paper>

            {/* Overview Summary Section */}
            <Paper
                elevation={2}
                sx={{
                    width: "80%",
                    maxWidth: "900px",
                    textAlign: "center",
                    p: 3,
                    borderRadius: "10px",
                    mb: 4,
                    background: "#fff",
                    borderLeft: "6px solid #ff5722",
                }}
            >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#333" }}>
                    🔍 Alert Summary Overview
                </Typography>
                <Typography sx={{ color: "#555", mt: 1 }}>
                    <strong>Active Alerts:</strong> {alerts.length} | <strong>Resolved:</strong> 3 |
                    <strong> Pending:</strong> {alerts.length - 3}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                    Proactively addressing alerts ensures smoother operations and prevents unexpected disruptions.
                    Regular monitoring helps in optimizing inventory management.
                </Typography>
            </Paper>

            {/* Alerts Section */}
            <Box sx={{ width: "80%", maxWidth: "1000px", textAlign: "center", mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: "#0077b6", mb: 2 }}>
                    🏭 Real-Time Alerts
                </Typography>
                <Typography sx={{ color: "#555", mb: 3 }}>
                    Below are the current issues identified within the inventory, warehouse, and stock reports.
                    Addressing these promptly will enhance operational efficiency.
                </Typography>
            </Box>

            {alerts.length === 0 ? (
                <Typography sx={{ color: "#333", textAlign: "center", fontSize: "1.2rem" }}>
                    ✅ No active alerts. Everything is running smoothly!
                </Typography>
            ) : (
                <Container maxWidth="md">
                    <Grid container spacing={3} justifyContent="center">
                        {alerts.map((alert, index) => (
                            <Grid item xs={12} sm={6} md={4} key={alert.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card
                                        sx={{
                                            background: alert.check.includes("Critical")
                                                ? "#ffebee"
                                                : alert.check.includes("Low Stock")
                                                    ? "#fffde7"
                                                    : "#e3f2fd",
                                            color: "#222",
                                            p: 2,
                                            borderRadius: "12px",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                            borderLeft: `5px solid ${alert.check.includes("Critical")
                                                ? "#d32f2f"
                                                : alert.check.includes("Low Stock")
                                                    ? "#fbc02d"
                                                    : "#0288d1"
                                                }`,
                                        }}
                                    >
                                        <CardContent>
                                            <Typography fontWeight="bold" sx={{ color: "#111" }}>
                                                {alert.check}
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {alert.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#555" }}>
                                                {alert.stock
                                                    ? `Stock Left: ${alert.stock}`
                                                    : alert.issue
                                                        ? `Issue: ${alert.issue}`
                                                        : alert.missing
                                                            ? `Missing: ${alert.missing}`
                                                            : ""}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            )}

            {/* Footer Message */}
            <Typography sx={{ mt: 5, fontStyle: "italic", color: "#444", textAlign: "center" }}>
                "Great companies are built on great products." – Elon Musk
            </Typography>
        </Box>
    );
};

export default StockAlertPage;
