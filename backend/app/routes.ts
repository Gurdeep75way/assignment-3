import express from "express";
import userRoutes from "./user/user.route";

const router = express.Router();
router.use("/user", userRoutes);
router.use("/warehouse", warehouseRoutes);
router.use("/inventory", inventoryRoutes);
// router.use("/sales", salesRoutes);

export default router;