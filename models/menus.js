import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  menuPicture: { type: String, alias: "menupicture" }, // ✅ old key supported
  menuName: { type: String, required: true, alias: "menuname" },
  menuDescription: { type: String, required: true, alias: "menudescription" },
  menuPrice: { type: Number, required: true, alias: "menuprice" },
  
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
});

export default mongoose.model("Menu", menuSchema);
