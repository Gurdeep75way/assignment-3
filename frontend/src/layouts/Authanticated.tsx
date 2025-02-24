import React, { useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useLogoutMutation } from "../services/api";
import { useAppSelector } from "../store/store";
import { motion } from "framer-motion";

export default function Navbar() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [logoutUser] = useLogoutMutation();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutUser();
    handleMenuClose();
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box>
      {/* Navbar */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          color: "#333",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)", // Shadow fix
          zIndex: 1201, // Ensure it stays above other elements
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "#003366", // Heading Color Fix
              fontWeight: "bold",
              fontFamily: "Poppins, sans-serif",
              transition: "0.3s",
              "&:hover": { color: "#1976D2", transform: "scale(1.1)" },
            }}
          >
            Stocklytics
          </Typography>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {isAuthenticated ? (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/alerts">Stock Alerts</NavLink>
                <NavLink to="/warehouses">Warehouses</NavLink>
                <NavLink to="/inventory">Inventory</NavLink>
                <NavLink to="/reports">Reports</NavLink>
                <NavLink to="/contact-us">Contact</NavLink>
                <NavLink to="/policy">Policy</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </Box>

          {/* Profile Dropdown */}
          {isAuthenticated && (
            <Box>
              <IconButton onClick={handleMenuOpen} sx={{ color: "#003366" }}>
                <AccountCircleIcon fontSize="large" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "#f9f9f9",
                    color: "#333",
                    borderRadius: "10px",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Divider />
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    "&:hover": { background: "#1976D2", color: "#fff" },
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "white",
            color: "#003366", // Dark color fix
            width: "250px",
          },
        }}
      >
        <List>
          {isAuthenticated ? (
            <>
              <MobileNavItem to="/">Home</MobileNavItem>
              <MobileNavItem to="/dashboard">Dashboard</MobileNavItem>
              <MobileNavItem to="/alerts">Stock Alerts</MobileNavItem>
              <MobileNavItem to="/warehouses">Warehouses</MobileNavItem>
              <MobileNavItem to="/inventory">Inventory</MobileNavItem>
              <MobileNavItem to="/reports">Reports</MobileNavItem>
              <MobileNavItem to="/contact-us">Contact</MobileNavItem>
              <MobileNavItem to="/policy">Policy</MobileNavItem>
              <Divider sx={{ bgcolor: "#1976D2" }} />
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" sx={{ textAlign: "center", "&:hover": { color: "#1976D2" } }} />
              </ListItem>
            </>
          ) : (
            <>
              <MobileNavItem to="/login">Login</MobileNavItem>
              <MobileNavItem to="/register">Register</MobileNavItem>
            </>
          )}
        </List>
      </Drawer>

      <Outlet />
    </Box>
  );
}

/* NavLink Component with Smooth Animations */
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Typography
        component={Link}
        to={to}
        sx={{
          textDecoration: "none",
          color: "#003366", // Heading color fix
          fontSize: "1.1rem",
          fontWeight: "bold",
          transition: "0.3s",
          "&:hover": { color: "#1976D2" },
        }}
      >
        {children}
      </Typography>
    </motion.div>
  );
};

/* MobileNavItem Component */
const MobileNavItem = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <ListItem button component={Link} to={to}>
      <ListItemText primary={children} sx={{ textAlign: "center", "&:hover": { color: "#1976D2" } }} />
    </ListItem>
  );
};
