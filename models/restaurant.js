import mongoose from "mongoose";

const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    restaurantPicture: {
      type: String, // ✅ Cloudinary or uploads URL
      default: null, // ✅ stays null if no image is uploaded
    },
    restaurantName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    opentime: {
      type: String,
      required: true,
    },
    closetime: {
      type: String,
      required: true,
    },
    menus: [
      {
        menuName: String,
        menuDescription: String,
        menuPrice: Number,
        menuPicture: String,
      },
    ],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
