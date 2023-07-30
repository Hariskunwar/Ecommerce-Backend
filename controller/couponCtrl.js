const Coupon=require("../models/couponModel");
const asyncHandler=require("express-async-handler");

//create a coupon
const createCoupon=asyncHandler(async (req,res)=>{
    const newCoupon=await Coupon.create(req.body);
    res.status(200).json(newCoupon);
});

//get all coupon
const getAllCoupon=asyncHandler(async (req,res)=>{
    const coupons=await Coupon.find();
    res.json(coupons);
});

//update a coupon
const updateCoupon=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const updatedCoupon=await Coupon.findByIdAndUpdate(id,req.body,{new:true});
    res.json(updatedCoupon);
})

//delete a coupon
const deleteCoupon=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const deletedCoupon=await Coupon.findByIdAndDelete(id);
    res.json(deletedCoupon)
})

module.exports={createCoupon,getAllCoupon,updateCoupon,deleteCoupon}