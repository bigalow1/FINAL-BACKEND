import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from '../sendEmail.js'


const forSignup = async (req,res)=>{
  try {
      let {fullname,email,password, role} = req.body;
      if(!fullname || !email || !password) {
        return res.status(400).json({message:"All fields are required"});
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {       
        return res.status(409).json({message:"User already exists"});
      }


    let hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
        fullname,
        email,
        password : hashedPassword,
        role
    });

  const welcomeMail =`
   <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #bfdbe4ff; padding: 20px; border-radius: 5px;">
      <h1><center>Welcome to Our Platform </center> <img scr="https://res.cloudinary.com/dh8dtvvy6/image/upload/v1752755027/Blog_pictures/vdktuipzojruyrasa9hw.jpg" width="70px"/></h1>
      <p>Hi ${fullname},</p>\n\n
      <p>Welcome to our platform! We're excited to have you on board.\n\n</p>
      <ol>
        <li>Explore our features and services.</li>
        <li>Stay updated with our latest news.</li>
        <li>Feel free</li>
        </ol>
        <p>Best regards,\n\n</p>
        <p>The Team</p>
        </p> contact us at:< href="mailto:${process.env.EMAIL_USER}
        
    <div>
    `;

    await sendEmail(email, "Welcome to Our website", welcomeMail);

    res.status(201).json({message:"User created successfully"});
    
  } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    
  }

   
}

const forLogin = async (req,res)=>{
   try{
     let {email,password} = req.body;

      const checkPassword = await User.findOne({email});

      if (!checkPassword) {
        return res.status(404).json({message:"user not found"})
       };

       let PasswordMatch = await bcrypt.compare(password,checkPassword.password);
       console.log(checkPassword)

        if (!PasswordMatch) {
        return res.status(403).json({message: "invalid password"})
      }
       //    Generate JWT token  
       const token =jwt.sign(
        { id: checkPassword._id, role: checkPassword.role},
        process.env.SECRET_KEY,
        { expiresIn:'3h'}
        );
    
        res.cookie('token',token, {
            httpOnly: true,
            secure:false,
            sameSite: 'Lax',
            maxAge: 3 * 60 * 60 * 1000 // 3 hours
        });

        res.status(200).json({message: "Login successful"})

    } catch(error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
    

}

const getAllUsers = async (req,res)=>{
    const myUsers = await User.find()

    if(!myUsers) return res.status(404).json({message:"No users found"});

    res.status(200).send(myUsers)
}

const get1User = async (req,res)=>{
    let {id} = req.params;

    const oneUser = await User.findById(id);

    if(!oneUser) return res.status(404).json({message:"No user found"});
    
    res.status(200).send(oneUser)

}

const del1User = async (req,res)=>{
    let {id} = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id);

    if(!deletedUser) return res.status(404).json({message:"No user found"});

    res.status(200).json({messgae:"User deleted successfully"})
}

const update1User = async (req,res)=>{
    let {id} = req.params;

    let newData = req.body;

    let updatedUser = await User.findByIdAndUpdate(id, newData, {new:true});

    if(!updatedUser) return res.status(404).json({message:"user not found"});

    res.status(200).json({messgae:"User updated successfully"})
}

export {
    getAllUsers,
    get1User, 
    del1User,
    update1User,
    forSignup,
    forLogin
}