const express=require("express");
const { registerUser, userLogin, getAllUser, getUser, updateUser, deleteUser, blockUser, unBlockUser, updatePassword, forgetPasswordToken, resetPassword, handleRefresToken, logout, getWishlist, userCart, getUserCart, emptyCart, applyCoupon } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router=express.Router();

//route for user registeration
router.post("/register",registerUser)
//route for user login
router.post("/login",userLogin)
//create cart route
router.post("/cart",authMiddleware,userCart)
//apply coupon route
router.post("/apply-coupon",authMiddleware,applyCoupon)
//route to generate forgot password token
router.post("/forgot-password",forgetPasswordToken)

//get all user route:only logged in user who is admin can get all user
router.get("/all-user",authMiddleware,isAdmin,getAllUser)
//route to handle refresh token
router.get('/refresh',handleRefresToken);
//route for logout
router.get("/logout",logout)
//get user wishlist route
router.get("/wishlist",authMiddleware,getWishlist)
//get user cart route
router.get("/get-cart",authMiddleware,getUserCart)
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
 
//remove user cart route
router.delete("/empty-cart",authMiddleware,emptyCart)
//route for user deleting their own account
router.delete('/delete', authMiddleware, deleteUser);
//route for admin deleting user accounts
router.delete('/admin/:id', authMiddleware,isAdmin, deleteUser);





module.exports=router;