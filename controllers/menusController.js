import menus from "../models/menus.js";
import restaurant from "../models/restaurant.js";

// CREATE a menu under a restaurant
export const newMenu= async (req, res) => {
  try {
    const { id } = req.params;
    const { menuName, menuDescription, menuPrice } = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const newMenu =  menus({
      menuName,
      menuDescription,
      menuPrice,
      menuPicture: req.file ? req.file.path : null, // ✅ handle no file
      restaurant: id,
    });

    await newMenu.save();

    restaurant.menus.push(newMenu._id);
    await restaurant.save();

    res.status(201).json({ success: true, menu: newMenu });
  } catch (err) {
    console.error("❌ Add menu error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




// GET all menus (with restaurant info)
export const getAllMenus = async (req, res) => {
  try {
    const myMenus = await menus.find().populate({
      path: "restaurant",
      select: "restaurantname",
    });

    if (!myMenus.length) {
      return res.status(404).json({ message: "No menus found" });
    }

    res.status(200).json(myMenus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET one menu
export const get1Menu = async (req, res) => {
  try {
    const { id } = req.params;

    const oneMenu = await menus.findById(id).populate({
      path: "restaurant",
      select: "restaurantname",
    });

    if (!oneMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json(oneMenu);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE a menu
export const del1Menu = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMenu = await menus.findByIdAndDelete(id);
    if (!deletedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // ✅ Remove from restaurant's menu array
    await restaurant.findByIdAndUpdate(deletedMenu.restaurant, {
      $pull: { menus: id },
    });

    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE a menu
export const update1Menu = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const updatedMenu = await menus.findByIdAndUpdate(id, newData, { new: true });
    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json({
      message: "Menu updated successfully",
      menu: updatedMenu,
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
