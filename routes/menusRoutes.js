import express from "express";
import multer from "multer";
import path from "path";
import Menu from "../models/menus.js"; // ✅ import mongoose model
import {
  newMenu,
  del1Menu,
  get1Menu,
  update1Menu,
} from "../controllers/menusController.js";
import authorize from "../middlewares/authorize.js";
import menus from "../models/menus.js";

const router = express.Router();

// Storage config for image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ Serve static uploaded images
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// POST → create a new menu
router.post(
  "/restaurant/:restaurantId/menus",
  upload.single("menuPicture"),
  newMenu
);

// GET → all menus with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // ✅ Use the real mongoose model
    const items = await menus.find().skip(skip).limit(limit);
    const total = await menus.countDocuments();

    // ✅ Convert picture path to full URL
    const host = `${req.protocol}://${req.get("host")}`;
    const mapped = items.map((m) => ({
      _id: m._id,
      menuName: m.menuName,
      menuDescription: m.menuDescription,
      menuPrice: m.menuPrice,
      menuPicture: m.menuPicture?.startsWith("http")
        ? m.menuPicture
        : m.menuPicture
        ? `${host}/${m.menuPicture}`
        : null,
    }));

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: mapped,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch menus", error: err.message });
  }
});

// GET → single menu
router.get("/:id", get1Menu);

// DELETE → only admins
router.delete("/:id", authorize(["Admin"]), del1Menu);

// PUT → update menu
router.put("/:id", update1Menu);

export default router;
