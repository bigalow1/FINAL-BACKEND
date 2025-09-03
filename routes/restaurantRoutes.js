import e from "express";
import authorize from '../middlewares/authorize.js';
import { del1Restaurant, get1Restaurant, getAllRestaurants, update1Restaurant , addRestaurant } from "../controllers/restaurantController.js";
const router = e.Router(); 
import upload from "../middlewares/multer.js";


router.post('/',upload.single('image'),addRestaurant);

router.get('/:id',authorize(['Admin']), getAllRestaurants);

router.get('/:id',authorize(['Admin']), get1Restaurant) 

router.delete('/:id',authorize(['Admin']), del1Restaurant)

router.put('/:id',authorize(['Admin']), update1Restaurant)




export default router