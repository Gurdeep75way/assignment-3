import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#0000",
                color: "#212121",
                flexDirection: "column",
                textAlign: "center",
            }}
        >
            <Typography variant="h1" component="h1" sx={{ fontSize: "5rem", fontWeight: "bold" }}>
                404
            </Typography>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Oops! The page you're looking for does not exist.
            </Typography>
            <Button
                variant="contained"
                sx={{
                    backgroundColor: "#004455",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "12px",
                    '&:hover': {
                        backgroundColor: "#003366",
                        scale: 1.1,
                        transition: "Animation",
                        ease: "easeInOut"
                    },
                }}
                onClick={() => navigate("/")}
            >
                Go Back to Home
            </Button>
        </Box>
    );
}
