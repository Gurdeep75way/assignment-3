import { Box, Typography, Container, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import animationData from "../assets/privacy-policy-animation.json"; // Replace with your animation JSON file path

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

export default function PrivacyPolicy() {
    const theme = useTheme();

    return (
        <Box
            minHeight="100vh"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="#FFFFFF" // White background
            padding={{ xs: 3, md: 6 }}
        >
            <Container maxWidth="lg">
                <Box
                    display="flex"
                    flexDirection={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems="center"
                    gap={{ xs: 5, md: 10 }}
                >
                    {/* Animation Section */}
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flex={1}
                        maxWidth={{ xs: "100%", md: "50%" }}
                        bgcolor="#F9F9F9" // Light Gray Background
                        padding={5}
                        borderRadius={3}
                        sx={{
                            boxShadow: theme.shadows[4], // Soft shadow
                        }}
                    >
                        <Lottie
                            options={defaultOptions}
                            height="auto"
                            width="100%"
                            style={{ maxWidth: "340px" }} // Increased size for better impact
                        />
                    </Box>

                    {/* Privacy Policy Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            flex: 1,
                            padding: "2.5rem",
                            background: "#F9F9F9", // Light Gray Background
                            color: "#212121", // Dark Gray Text
                            borderRadius: 10,
                            overflowY: "auto",
                            maxHeight: "75vh",
                            boxShadow: theme.shadows[4],
                        }}
                    >
                        <Typography
                            variant="h3"
                            fontWeight="600"
                            color="#003366" // Dark Blue Heading
                            textAlign="center"
                            mb={4}
                        >
                            Privacy Policy
                        </Typography>

                        <Typography variant="body1" color="#424242" paragraph>
                            Your privacy is important to us. This Privacy Policy explains how we
                            collect, use, and protect your personal data when you interact with our
                            platform.
                        </Typography>

                        <Typography variant="h5" color="#003366" mt={3} fontWeight="500">
                            🔹 Information Collection
                        </Typography>
                        <Typography variant="body1" color="#424242" paragraph>
                            We may collect personal details such as your name, email address, and
                            other relevant information. Cookies may also be used for tracking
                            purposes.
                        </Typography>

                        <Typography variant="h5" color="#003366" mt={3} fontWeight="500">
                            🔹 How We Use Your Information
                        </Typography>
                        <Typography variant="body1" color="#424242" paragraph>
                            Your information is used to improve our services, personalize your
                            experience, and ensure smooth communication. We do not share your data
                            with third parties unless legally required.
                        </Typography>

                        <Typography variant="h5" color="#003366" mt={3} fontWeight="500">
                            🔹 Data Security
                        </Typography>
                        <Typography variant="body1" color="#424242" paragraph>
                            We use advanced security measures to protect your data. However, no
                            internet-based service is entirely risk-free.
                        </Typography>

                        <Typography variant="h5" color="#003366" mt={3} fontWeight="500">
                            🔹 Policy Updates
                        </Typography>
                        <Typography variant="body1" color="#424242" paragraph>
                            We may update this Privacy Policy from time to time. Any changes will
                            be communicated via our website.
                        </Typography>

                        <Typography
                            variant="body2"
                            color="#757575"
                            align="center"
                            mt={4}
                            fontStyle="italic"
                        >
                            Last updated: February 2025
                        </Typography>
                    </motion.div>
                </Box>
            </Container>
        </Box>
    );
}
