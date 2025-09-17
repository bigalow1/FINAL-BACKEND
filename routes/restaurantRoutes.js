import express from "express";
import Restaurant from "../models/restaurant.js"; // ✅ import your Mongoose model

const router = express.Router();

// Get all restaurants
router.get("/all", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get a single restaurant by ID
// restaurantRoutes.js




// ✅ Get single restaurant with menus populated
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate("menus"); 
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




// Add new restaurant
router.post("/", async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (err) {
    console.error("Error creating restaurant:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update restaurant
router.put("/:id", async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(updatedRestaurant);
  } catch (err) {
    console.error("Error updating restaurant:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete restaurant
router.delete("/:id", async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error("Error deleting restaurant:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
