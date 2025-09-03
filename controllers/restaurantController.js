import restaurant from "../models/restaurant.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const addRestaurant = async (req,res)=>{
  try {
      let {restaurantpicture,restaurantName,address,opentime,closetime} = req.body;

      if( !restaurantName || !address ||  !opentime || !closetime) {
        return res.status(400).json({message:"All fields are required"});
      }
      const image ={
           url: req.file?.path,
           filename: req.file?.filename
    }

    await restaurant.create({
        restaurantpicture:image,
        restaurantName,
        address,
        opentime,
        closetime
    });


    res.status(201).json({message:"restaurant created successfully"});
    
  } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
  }
}

const getAllRestaurants = async (req,res)=>{
    const myRestaurant = await restaurant.find()

    if(!myRestaurant) return res.status(404).json({message:"No restaurant found"});

    res.status(200).send(myRestaurant)
}

const get1Restaurant = async (req,res)=>{
    let {id} = req.params;

    const onerestaurant = await restaurant.findById(id);

    if(!onerestaurant) return res.status(404).json({message:"No restaurant found"});
    
    res.status(200).send(onerestaurant)

}

const del1Restaurant = async (req,res)=>{
    let {id} = req.params;
    
    const deletedrestaurant = await restaurant.findByIdAndDelete(id);

    if(!deletedrestaurant) return res.status(404).json({message:"No restaurant found"});

    res.status(200).json({messgae:"restaurant deleted successfully"})
}

const update1Restaurant = async (req,res)=>{
    let {id} = req.params;

    let newData = req.body;

    let update1Restaurant = await restaurant.findByIdAndUpdate(id, newData, {new:true});

    if(!update1Restaurant) return res.status(404).json({message:"restaurant not found"});

    res.status(200).json({messgae:"restaurant updated successfully"})
}

export {
    getAllRestaurants,
    get1Restaurant, 
    del1Restaurant,
    update1Restaurant,
    addRestaurant}