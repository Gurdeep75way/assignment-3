import React from "react";
import Reports from "../components/Reports";
import { Container, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const ReportsPage: React.FC = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh", // Soft blue background
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "40px 20px",
            }}
        >
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "700",
                        color: "#003366", // Dark blue text
                        textAlign: "center",
                        mb: 1,
                    }}
                >
                    📊 Reports Dashboard
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: "#004080", // Slightly lighter blue
                        textAlign: "center",
                        mb: 4,
                        fontSize: "16px",
                    }}
                >
                    View detailed insights and analytics of your products.
                </Typography>
            </motion.div>

            {/* Reports Component */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        background: "#FFFFFF",
                        padding: "24px",
                        borderRadius: "12px",
                        boxShadow: "0px 5px 15px rgba(0, 51, 102, 0.2)", // Subtle blue shadow
                        border: "1px solid #003366",
                    }}
                >
                    <Reports />
                </Container>
            </motion.div>

            {/* Footer Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 20px",
                    background: "#003366", // Dark blue footer
                    color: "#ffffff",
                    borderRadius: "8px",
                    marginTop: "40px",
                    width: "fit-content", // Makes it fit the content, avoiding full width
                }}
            >
                <Typography variant="body2" sx={{ fontSize: "14px" }}>
                    © {new Date().getFullYear()} Your Company | All Rights Reserved
                </Typography>
            </Box>
        </Box>
    );
};

export default ReportsPage;
