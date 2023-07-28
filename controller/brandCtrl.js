const Brand=require("../models/brandModel");
const asyncHandler=require("express-async-handler");

//create category
const createBrand=asyncHandler(async (req,res)=>{
    const newBrand=await Brand.create(req.body);
    res.status(200).json(newBrand);
});

//get a category
const getBrand=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const brand=await Brand.findById(id);
    res.status(200).json(brand);
})

//get all category
const getAllBrand=asyncHandler(async (req,res)=>{
    const brands=await Brand.find();
    res.json(brands);
})

//update a category
const updateBrand=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const updatedBrand=await Brand.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json(updatedBrand);
});

//delete a category
const deleteBrand=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const deletedBrand=await Brand.findByIdAndDelete(id)
    res.json({message:"brand deleted"})
});

module.exports={createBrand,getBrand,getAllBrand,updateBrand,deleteBrand}