import mongoose from "mongoose";
import { type } from "os";
import { ref } from "process";
 
const Schema = mongoose.Schema;

const restaurantSchema = Schema({

    restaurantPicture: {
        type: String,
        filename: String

    },
    restaurantName: {
        type: String, 
        require: true 
    },
    address:{
        type:String,
        require:true
    },
    opentime: {
        type: String, 
        require: true 
    },
    closetime: {
        type: String, 
        require: true 
    },
    menus:{
        type:[{type:mongoose.Schema.Types.ObjectId,ref:'menus'}],
    }

},{timestamps: true})

const restaurant = mongoose.model('restaurant',restaurantSchema);

export default restaurant