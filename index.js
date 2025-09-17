import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menusRoutes from "./routes/menusRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";

// Import models
import Restaurant from "./models/restaurant.js";
import Menu from "./models/menus.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

/// ✅ Configure CORS

// ✅ Middlewares
app.use(express.json({ limit: "10mb" })); // handle JSON + large images
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// allow all origins (development only)
app.use(cors({
  origin: "*", // or ["http://localhost:5173", "https://your-frontend-domain.com"]
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// ✅ Restaurants (fetch all)
app.get("/all", async (req, res) => {
  try {
    const restaurant = await Restaurant.find();
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch restaurants",
      error: err.message,
    });
  }
});

// ✅ Menus (fetch all)
app.get("/menus", async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch menus",
      error: err.message,
    });
  }
});

// ✅ Add menu to restaurant
app.post("/restaurant/:restaurantId/menus", async (req, res) => {
  try {
    const { menuName, menuDescription, menuPrice, menuPicture } = req.body;

    if (!menuName || !menuPrice) {
      return res
        .status(400)
        .json({ message: "Menu name and price are required" });
    }

    const newMenu = new Menu({
      menuName,
      menuDescription,
      menuPrice,
      menuPicture,
      restaurant: req.params.restaurantId,
    });

    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(500).json({ message: "Failed to add menu", error: err.message });
  }
});

// ✅ Get menus for a specific restaurant
app.get("/restaurant/:restaurantId/menus", async (req, res) => {
  try {
    const menus = await Menu.find({ restaurant: req.params.restaurantId });
    res.json(menus);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch menus for restaurant",
      error: err.message,
    });
  }
});

// ✅ Other routes
app.use("/user", userRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/menus", menusRoutes);
app.use("/orders", ordersRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ Start server
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
