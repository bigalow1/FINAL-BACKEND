import e from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import restaurantRoutes from "./routes/restaurantRoutes.js";    
import menusRoutes from "./routes/menusRoutes.js";



config();
const app = e();
const port = process.env.PORT || 3500;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Mongodb connected successfully"))
  .catch((err) => console.log("Mongodb connection failed", err));
app.use(cookieParser());

app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.use(e.static("./box"));





// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//     credentials: true,
//   })
// );

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "box", "index.html"));
// });

app.use("/user", userRoutes);

app.use("/restaurant", restaurantRoutes);
app.use("/menus", menusRoutes);

app.use(
  cors({
    origin: [
      "http://localhost:5173",         // local dev
      "https://final-backend-57f6.onrender.com.com", // deployed frontend URL (replace with yours)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cors()); // allows all origins (not safe for production)


// app.use(express.json());

// Example route
// app.get("/menus", (req, res) => {
//   res.json([{ menuname: "Pizza", menuprice: 15 }]);
// });

// ✅ use Render’s port
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// app.listen(port, () => {
//   console.log(`server is runninng on port : ${port}`);
  
// });
