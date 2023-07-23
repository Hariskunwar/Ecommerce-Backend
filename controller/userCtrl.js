const User=require("../models/userModel");
const asyncHandler=require("express-async-handler");
const { generateToken } = require("../utils/jwtToken");

//register a user
const registerUser=asyncHandler(async (req,res)=>{
    const email=req.body.email;
    //check user already exist with email,as email is unique
    const findUser=await User.findOne({email:email})
    //if already not exist then create user
    if(!findUser){
        const createUser=await User.create(req.body);
        res.status(201).json(createUser);
    }
    //if user exist with email
    else{
        res.status(400);
        throw new Error("User already exist")
    }
});


module.exports={
    registerUser
}