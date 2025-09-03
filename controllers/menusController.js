import menus from "../models/menus.js";
import restaurant from "../models/restaurant.js";

const createMenu = async (req, res) => {
  try {
    let { menupicture, menuname,menudescription, menuprice, } = req.body;
    let { restaurantId } = req.params;
    if (!menupicture || !menuname || !menudescription || !menuprice) {
      return res.status(400).json({ message: "All fields are required" });
    }

   let checkRestaurant = await restaurant.findById(restaurantId);
    if(!checkRestaurant) return res.status(404).json({message:"No restaurant found"});
    

    const newMenu = await menus.create({
      menupicture,
      menuname,
      menudescription,
      menuprice,
      restaurant: restaurantId,
    });

    checkRestaurant.menus.push(newMenu._id);
    await checkRestaurant.save();

    res.status(201).json({ message: "Menu created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllMenus = async (req, res) => {
  const myMenus = await menus.find().populate({
    path: "author",
    select: "restaurantname",
  });

  if (!myMenus) return res.status(404).json({ message: "No menu found" });

  res.status(200).send(myMenus);
};

const get1Menu = async (req, res) => {
  let { id } = req.params;

  const oneMenu = await menus.findById(id).populate({
    path: "author",
    select: "restaurantname",
  });

  if (!oneMenu) return res.status(404).json({ message: "No menu found" });

  res.status(200).send(oneMenu);
};

const del1Menu = async (req, res) => {
  let { id } = req.params;

  const deletedMenu = await menus.findByIdAndDelete(id);

  if (!deletedMenu) return res.status(404).json({ message: "No menu found" });

  res.status(200).json({ messgae: "Menu deleted successfully" });
};

const update1Menu = async (req, res) => {
  let { id } = req.params;

  let newData = req.body;

  let updatedMenu = await menus.findByIdAndUpdate(id, newData, { new: true });

  if (!updatedMenu) return res.status(404).json({ message: "Menu not found" });

  res.status(200).json({ messgae: "Menu updated successfully" });
};

export { getAllMenus, get1Menu, del1Menu, update1Menu, createMenu };
