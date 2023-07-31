import express from "express";
import authorization from "../middlewares/authorization.js";
import tokenValidation from '../middlewares/tokenValidation.js';


import {addUserController, emailVarification,fetchAllUserController, fetchOneUserController, updateUserController, deleteUserController, loginUserController, forgetPasswordController, resetPasswordController, logoutUserController} from "../controllers/user.controller.js";



const route = express.Router();

route.post('/add', addUserController);

route.get('/verifyEmail/:emailToken', emailVarification);

route.get('/fetchAll', [tokenValidation, authorization(["admin"])] ,fetchAllUserController);

route.get('/fetchOne/:id',[tokenValidation, authorization(["admin", "customer"])], fetchOneUserController);

route.put('/update',[tokenValidation, authorization(["admin", "customer"])], updateUserController);

route.delete('/delete',[tokenValidation,authorization(["customer"])] ,deleteUserController);

route.post('/login', loginUserController);

route.post('/forgetPassword', forgetPasswordController);

route.post('/resetPassword', resetPasswordController);

route.delete('/logout', authorization(["admin", "customer"]) ,logoutUserController);

export default route;

