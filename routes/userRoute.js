const express=require("express");
const { registerUser } = require("../controller/userCtrl");

const router=express.Router();

//route for user registeration
router.post("/register",registerUser)


module.exports=router;