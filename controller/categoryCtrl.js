const Category=require("../models/categoryModel");
const asyncHandler=require("express-async-handler");

//create category
const createCategory=asyncHandler(async (req,res)=>{
    const newCategory=await Category.create(req.body);
    res.status(200).json(newCategory);
});

//get a category
const getCategory=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const category=await Category.findById(id);
    res.status(200).json(category);
})

//get all category
const getAllCategory=asyncHandler(async (req,res)=>{
    const categories=await Category.find();
    res.json(categories);
})

//update a category
const updateCategory=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const updatedCategory=await Category.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json(updatedCategory);
});

//delete a category
const deleteCategory=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const deleteCat=await Category.findByIdAndDelete(id)
    res.json({message:"category deleted"})
});

module.exports={createCategory,getCategory,getAllCategory,updateCategory,deleteCategory}