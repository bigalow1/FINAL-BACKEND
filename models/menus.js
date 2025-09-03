import mongoose from "mongoose";
const Schema = mongoose.Schema;

const menusSchema = Schema({
    menupicture: {
        type: String, 
        default: "https://res.cloudinary.com/dz1qj0x2f/image/upload/v1735681234/connection/default-profile-picture.png"
    },
    menuname:{
        type: String, 
        require: true 
    },
    menudescription:{
        type: String, 
        require: true 
    },
    menuprice:{
        type: Number, 
        require: true
    },
    
    
},{timestamps: true})

const menus = mongoose.model('Menus', menusSchema);

export default menus;