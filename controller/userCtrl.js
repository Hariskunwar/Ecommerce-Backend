const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/jwtToken");

//register a user
const registerUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    //check user already exist with email,as email is unique
    const findUser = await User.findOne({ email: email })
    //if already not exist then create user
    if (!findUser) {
        const createUser = await User.create(req.body);
        res.status(201).json(createUser);
    }
    //if user exist with email
    else {
        res.status(400);
        throw new Error("User already exist")
    }
});

//user login 
const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //first check user exist or not with the help of email
    const user = await User.findOne({ email: email });
    //if user found and password matched, generate token
    if (user && (await user.isPasswordMatched(password))) {
        res.status(200).json({
            username: user?.name,
            token: generateToken(user?._id)
        })
    } else {
        res.status(401);
        throw new Error("Invalid credentials")
    }
})

//get all user
const getAllUser = asyncHandler(async (req, res) => {
    const allUser = await User.find()
    const users = allUser.map((user) => ({
        userId: user._id,
        username: user.name,
        email: user.email,
        mobile: user.mobile
    }))
    res.status(200).json(users)
})

//get single user
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({
        userId: user._id,
        username: user.name,
        email: user.email,
        mobile: user.mobile,
        isAdmin: user.isAdmin,
        registerationDate: user.createdAt,
        isBlocked:user.isBlocked
    })
})

//user profile update
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile
    }, { new: true })
    res.status(200).json({
        userId: user._id,
        username: user.name,
        email: user.email,
        mobile: user.email
    })
})

//user deletion
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const adminDeleteUser=await User.findById(id)
    const user = req.user
  
    
        if (id && !adminDeleteUser.isAdmin) {
            //admin deletes a specific user account
            await User.findByIdAndDelete(id);
            res.status(200).json("User account  deleted succussfully ")
        }
        else if (!user.isAdmin) {
            //user deleting their own account
            await User.findByIdAndDelete(user._id)
            res.status(200).json("Your account deleted successfully")
        }
        else{
            res.status(403)
            throw new Error('You are not authorized to delete this account')
        }

    });

    //block user
    const blockUser=asyncHandler(async (req,res)=>{
        const {id}=req.params;
        const block=await User.findByIdAndUpdate(id,{isBlocked:true},{new:true})
        res.status(200).json({message:"user blocked successfully"})
    })

    //unblock user
    const unBlockUser=asyncHandler(async (req,res)=>{
        const {id}=req.params;
        const unblock=await User.findByIdAndUpdate(id,{isBlocked:false},{new:true})
        res.status(200).json({message:"user unblocked successfully"})
    })


module.exports = {
    registerUser, userLogin, getAllUser, getUser, updateUser, deleteUser,
    blockUser,unBlockUser
}