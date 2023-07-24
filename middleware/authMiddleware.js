const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const asyncHandler=require("express-async-handler");

const authMiddleware=asyncHandler(async (req,res,next)=>{
    let token;
    if(req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(' ')[1]
        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            const user=await User.findById(decoded.id)
            //attach this user with req object
            req.user=user;
            next()
        }catch(error){
            console.log(error);
            res.status(401);
            throw new Error("Token expired , login again")
        }

    }else{
        res.status(401);
        throw new Error("there is no token in header")
    }
});

const isAdmin=asyncHandler(async (req,res,next)=>{
    const {email}=req.user;
    const user=await User.findOne({email:email})
    if(!user.isAdmin){
        res.status(403)
        throw new Error("You are not an admin")
    }else{
        next()
    }

});

module.exports={authMiddleware,isAdmin}

