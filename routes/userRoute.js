const express=require("express");
const { registerUser, userLogin, getAllUser } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router=express.Router();

//route for user registeration
router.post("/register",registerUser)
//route for user login
router.post("/login",userLogin)

//get all user route:only logged in user who is admin can get all user
router.get("/all-user",authMiddleware,isAdmin,getAllUser)


module.exports=router;