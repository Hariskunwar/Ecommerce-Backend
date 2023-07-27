const Product=require("../models/productModel");
const asyncHandler=require("express-async-handler");
const slugify=require("slugify");

//create prodcut
const createProduct=asyncHandler(async (req,res)=>{
    if(req.body.title){
        req.body.slug=slugify(req.body.title);
    }
    const newProduct=await Product.create(req.body);
    res.status(200).json(newProduct);

});

//get a single product
const getProduct=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const product=await Product.findById(id);
    if(product){
        res.status(200).json({
            title:product.title,
            description:product.description,
            price:product.price,
            category:product.category,
            brand:product.category,
            images:product.images
        })
    }
    else{
        res.status(404).json({message:"product not found"});
    }
});

//get all product
const getAllProduct=asyncHandler(async (req,res)=>{
    const allProduct=await Product.find();
    const products=allProduct.map((product)=>({
         title:product.title,
         price:product.price,
         catgory:product.category
    }));
    res.status(200).json({products})
});

//product update 
const productUpdate=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    if(req.body.title){
        req.body.slug=slugify(req.body.title)
    }
    const updatedProduct=await Product.findByIdAndUpdate(id,req.body,{new:true})
    res.status(200).json(updatedProduct)
})

//delete a product
const deleteProduct=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const deletedProduct=await Product.findByIdAndDelete(id);
    res.status(200).json(deletedProduct)
})


module.exports={
    createProduct,getProduct,getAllProduct,productUpdate,
    deleteProduct
};