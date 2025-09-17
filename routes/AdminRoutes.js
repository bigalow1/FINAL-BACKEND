import express from "express";
import { authenticate, authorizeRole } from "../middleware/auth.js";
import { getAllUsers } from "../controllers/usercontroller.js";
import { approveRestaurant, rejectRestaurant } from "../controllers/restaurantController.js";

const router = express.Router();

// ✅ Only Admins can see all users
router.get("/users", authenticate, authorizeRole("Admin"), getAllUsers);

// ✅ Only Admins can approve/reject restaurants
router.put("/restaurants/:id/approve", authenticate, authorizeRole("Admin"), approveRestaurant);
router.put("/restaurants/:id/reject", authenticate, authorizeRole("Admin"), rejectRestaurant);

export default router;
