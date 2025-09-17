import restaurant from "../models/restaurant.js";
import menus from "../models/menus.js";

// ➕ Create a restaurant
export const createRestaurant = async (req, res) => {
  try {
    const { restaurantName, address, opentime, closetime } = req.body;

    const newRestaurant = new restaurant({
      restaurantName,
      address,
      opentime,
      closetime,
      restaurantPicture: req.file ? req.file.path : null, // ✅ optional picture
    });

    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(500).json({ message: "Error creating restaurant", error: err.message });
  }
};




// 📖 Get all restaurants (with menus)
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurant.find().populate("menus");
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📖 Get 1 restaurant by ID
export const get1Restaurant = async (req, res) => {
  try {
    const restaurant = await restaurant.findById(req.params.id).populate("menus");
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update 1 restaurant
export const update1Restaurant = async (req, res) => {
  try {
    const restaurant = await restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🗑 Delete 1 restaurant
export const del1Restaurant = async (req, res) => {
  try {
    const restaurant = await restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Also delete all menus linked to this restaurant
    await menus.deleteMany({ restaurant: req.params.id });

    res.json({ message: "Restaurant and its menus deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

