import { Box, Button, Typography, Container, Grid, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store/store";

const features = [
  { title: "Real-time Inventory Tracking", description: "Monitor stock levels, orders, and updates instantly." },
  { title: "Automated Stock Alerts", description: "Get notified when stock is low or running out." },
  { title: "Advanced Analytics", description: "Gain insights with sales trends and stock predictions." },
  { title: "Seamless Integration", description: "Connect with eCommerce platforms and ERP systems." },
];

const testimonials = [
  { name: "Amit Sharma", feedback: "Managing inventory has never been easier! This system is a game changer. 🔥" },
  { name: "Priya Kapoor", feedback: "The analytics dashboard helps me optimize stock levels perfectly! 📊" },
  { name: "Rajesh Kumar", feedback: "Smooth UI, powerful automation, and great customer support! 💯" },
];

const Home = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#FFFFFF",
        color: "#333333",
        p: 4,
      }}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ fontFamily: "Poppins, sans-serif", color: "#003366" }}
          gutterBottom
        >
          Smart Inventory Management 📦
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: "900px", opacity: 0.9 }}>
          Track, manage, and optimize your inventory with ease and efficiency.
        </Typography>
      </motion.div>

      {/* Call to Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {isAuthenticated ? (
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            sx={{
              mt: 4,
              background: "#003366",
              color: "#FFFFFF",
              fontSize: "18px",
              px: 4,
              py: 1.5,
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { background: "#002244" },
            }}
          >
            Go to Dashboard 📊
          </Button>
        ) : (
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              mt: 4,
              background: "#FF6600",
              color: "#FFFFFF",
              fontSize: "18px",
              px: 4,
              py: 1.5,
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { background: "#CC5500" },
            }}
          >
            Login / Sign Up 🔑
          </Button>
        )}
      </motion.div>

      {/* Features Section */}
      <Container sx={{ mt: 8 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ fontFamily: "Poppins, sans-serif", color: "#000000" }}
          gutterBottom
        >
          Key Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    height: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#F8F8F8",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "15px",
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#000000" }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: "#212121" }}>{feature.description}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Container sx={{ mt: 8 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ fontFamily: "Poppins, sans-serif", color: "#000000" }}
          gutterBottom
        >
          What Our Clients Say
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    height: "170px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#F8F8F8",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "15px",
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" sx={{ fontStyle: "italic", color: "#333333" }}>
                      "{testimonial.feedback}"
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ mt: 1, fontWeight: "bold", color: "#003366" }}
                    >
                      - {testimonial.name}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          mt: 10,
          py: 3,
          px: 4,
          background: "#003366",
          color: "#FFFFFF",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">© {new Date().getFullYear()} InventoryPro | All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Home;
