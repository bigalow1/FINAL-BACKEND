import e from "express";
import authorize from '../middlewares/authorize.js';
import { del1User, forLogin, forSignup, get1User, getAllUsers, update1User } from "../controllers/usercontroller.js";
const router = e.Router(); 

router.post('/', forSignup);

router.post('/login', forLogin);

router.get('/', getAllUsers);

router.get('/:id', get1User) 

router.delete('/:id',authorize(['Admin']), del1User)

router.put('/:id', update1User)





export default router