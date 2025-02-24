import React from "react";
import { Box, Typography, Container, Card } from "@mui/material";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import contactAnimation from "../assets/contact.json"; // Add your Lottie JSON file

const ContactUs = () => {
    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                backgroundColor: "#FFFFFF", // Entire page is white
                color: "#212121", // Dark gray text
                p: { xs: 2, md: 4 }, // Responsive padding
            }}
        >
            <Container maxWidth="sm" sx={{ textAlign: "center" }}>
                {/* Lottie Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Lottie
                        animationData={contactAnimation}
                        loop
                        style={{ height: 180, maxWidth: "100%", marginBottom: 20 }}
                    />
                </motion.div>

                {/* Contact Heading */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: "bold",
                            mb: 3,
                            color: "#003366", // Navy blue heading
                            textTransform: "uppercase",
                            letterSpacing: 1.2,
                        }}
                    >
                        Contact Us
                    </Typography>

                    {/* Contact Information Card */}
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            bgcolor: "#f9f9f9", // Light grayish background for contrast
                            boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.05)", // Subtle shadow
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{ color: "#212121", mb: 2, fontSize: "1rem", fontWeight: 500 }}
                        >
                            📍 <strong>Address:</strong> 75way Technologies, Chandigarh, India
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: "#212121", mb: 2, fontSize: "1rem", fontWeight: 500 }}
                        >
                            📞 <strong>Phone:</strong> +91 98765 43210
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: "#212121", fontSize: "1rem", fontWeight: 500 }}
                        >
                            ✉️ <strong>Email:</strong> contact@75way.com
                        </Typography>
                    </Card>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ContactUs;
