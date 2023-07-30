const express=require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require("../controller/couponCtrl");


const router=express.Router();

//create coupon
router.post("/create",authMiddleware,isAdmin,createCoupon);
//get all coupon
router.get("/get-coupon",authMiddleware,isAdmin,getAllCoupon);
//update a coupon
router.put("/update/:id",authMiddleware,isAdmin,updateCoupon);
//delete a coupon
router.delete("/delete/:id",authMiddleware,isAdmin,deleteCoupon)


module.exports=router;