const express=require("express");
const { registerUser, userLogin } = require("../controller/userCtrl");

const router=express.Router();

//route for user registeration
router.post("/register",registerUser)
//route for user login
router.post("/login",userLogin)


module.exports=router;