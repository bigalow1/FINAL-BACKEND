import e from "express";
import {
  createMenu,
  del1Menu,
  get1Menu,
  getAllMenus,
  update1Menu,
} from "../controllers/menusController.js";
import authorize from "../middlewares/authorize.js";
import multer from "multer";

const router = e.Router();
export const upload = multer({});

router.post(
  "/:restaurantId",
  authorize(["Admin", "User"]),
  upload.single("image"),
  createMenu
);

router.get("/", getAllMenus);

router.get("/ :id", get1Menu);

router.delete("/:id", authorize(["Admin"]), del1Menu);

router.put("/:id", update1Menu);

export default router;
