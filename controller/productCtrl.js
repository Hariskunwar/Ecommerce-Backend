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

})


module.exports={createProduct};