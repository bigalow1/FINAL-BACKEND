import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../sendEmail.js";

// ================= SIGNUP =================
const forSignup = async (req, res) => {
  try {
    let { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    // ✅ Generate JWT immediately after signup
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );

    // ✅ Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "Lax",
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    // ✅ Send welcome email
    const welcomeMail = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #bfdbe4ff; padding: 20px; border-radius: 5px;">
        <h1><center>Welcome to Our Platform</center></h1>
        <img src="https://res.cloudinary.com/dh8dtvvy6/image/upload/v1752755027/Blog_pictures/vdktuipzojruyrasa9hw.jpg" width="70px"/>
        <p>Hi ${fullname},</p>
        <p>Welcome to our platform! We're excited to have you on board.</p>
      </div>
    `;
    await sendEmail(email, "Welcome to Our website", welcomeMail);

    // ✅ Return user + token
    res.status(201).json({
      message: "Signup successful",
      user: { id: newUser._id, fullname: newUser.fullname, email: newUser.email, role: newUser.role },
      token,
      redirect: "/checkout" // hint for frontend
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= LOGIN =================
const forLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let PasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!PasswordMatch) {
      return res.status(403).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: checkUser._id, role: checkUser.role },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    // ✅ Explicitly return the user object
    res.status(200).json({
      message: "Login successful",
      checkUser: {
        _id: checkUser._id,
        fullname: checkUser.fullname,
        email: checkUser.email,
        role: checkUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ================= USERS =================
const getAllUsers = async (req, res) => {
  const myUsers = await User.find();
  if (!myUsers || myUsers.length === 0) return res.status(404).json({ message: "No users found" });
  res.status(200).send(myUsers);
};

const get1User = async (req, res) => {
  const { id } = req.params;
  const oneUser = await User.findById(id);
  if (!oneUser) return res.status(404).json({ message: "No user found" });
  res.status(200).send(oneUser);
};

const del1User = async (req, res) => {
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) return res.status(404).json({ message: "No user found" });
  res.status(200).json({ message: "User deleted successfully" });
};

const update1User = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  const updatedUser = await User.findByIdAndUpdate(id, newData, { new: true });
  if (!updatedUser) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ message: "User updated successfully", updatedUser });
};

export {
  getAllUsers,
  get1User,
  del1User,
  update1User,
  forSignup,
  forLogin,
};
