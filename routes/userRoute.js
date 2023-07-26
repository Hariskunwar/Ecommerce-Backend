const express=require("express");
const { registerUser, userLogin, getAllUser, getUser, updateUser, deleteUser, blockUser, unBlockUser, updatePassword, forgetPasswordToken, resetPassword, handleRefresToken, logout } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router=express.Router();

//route for user registeration
router.post("/register",registerUser)
//route for user login
router.post("/login",userLogin)
//route to generate forgot password token
router.post("/forgot-password",forgetPasswordToken)

//get all user route:only logged in user who is admin can get all user
router.get("/all-user",authMiddleware,isAdmin,getAllUser)
//route to handle refresh token
router.get('/refresh',handleRefresToken);
//route for logout
router.get("/logout",logout)
//get single user route
router.get("/:id",authMiddleware,isAdmin,getUser)


//update user profile route
router.put("/update",authMiddleware,updateUser)
//user blocking route
router.put("/block/:id",authMiddleware,isAdmin,blockUser)
//user unblocking route
router.put("/unblock/:id",authMiddleware,isAdmin,unBlockUser)
//password update route
router.put("/password-update",authMiddleware,updatePassword)
//route for password reset
router.put("/password-reset/:token",resetPassword)

//route for user deleting their own account
router.delete('/delete', authMiddleware, deleteUser);
//route for admin deleting user accounts
router.delete('/admin/:id', authMiddleware,isAdmin, deleteUser);





module.exports=router;