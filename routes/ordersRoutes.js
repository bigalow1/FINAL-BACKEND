import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/ordersController.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.post("/",authorize(["User"]) ,createOrder); 
router.get("/", getOrders); 
router.get("/:id",authorize(["Admin"]), getOrderById); 
router.put("/:id/status",authorize(["Admin"]), updateOrderStatus); 
router.delete("/:id",authorize(["Admin"]), deleteOrder); 

export default router;
