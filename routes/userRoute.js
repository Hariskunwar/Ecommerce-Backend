const express=require("express");
const { registerUser, userLogin, getAllUser, getUser, updateUser, deleteUser } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router=express.Router();

//route for user registeration
router.post("/register",registerUser)
//route for user login
router.post("/login",userLogin)

//get all user route:only logged in user who is admin can get all user
router.get("/all-user",authMiddleware,isAdmin,getAllUser)
//get single user route
router.get("/:id",authMiddleware,isAdmin,getUser)

//update user profile route
router.put("/update",authMiddleware,updateUser)

//route for user deleting their own account
router.delete('/delete', authMiddleware, deleteUser);
//route for admin deleting user accounts
router.delete('/admin/:id', authMiddleware,isAdmin, deleteUser);



module.exports=router;