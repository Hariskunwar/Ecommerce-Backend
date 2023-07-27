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
})


module.exports={
    createProduct,getProduct
};