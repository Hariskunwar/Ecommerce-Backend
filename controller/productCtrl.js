const Product=require("../models/productModel");
const asyncHandler=require("express-async-handler");
const slugify=require("slugify");
const User=require("../models/userModel")

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
    const queryObj={...req.query}
    const excludeFields=['page','sort','limit','fields']
    excludeFields.forEach(el=>delete queryObj[el]);
    let queryStr=JSON.stringify(queryObj);
    queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
    let query=Product.find(JSON.parse(queryStr))
    
    //product sorting
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(" ")
        query=query.sort(sortBy)
    }else{
        query=query.sort("-createdAt")
    }

    //field limitation
    if(req.query.fields){
        const fields=req.query.fields.split(",").join(" ");
        query=query.select(fields);
    }else{
        query.select("-__v")
    }

    //pagination
    const page=req.query.page;
    const limit=req.query.limit;
    const skip=(page-1)*limit;
    query=query.skip(skip).limit(limit)
    if(req.query.page){
        const productCount=await Product.countDocuments();
        if(skip>=productCount) throw new Error("this page does not exist");
    }

    const products=await query;
    res.status(200).json(products);
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
});

//add product to wishlist
const addToWishlist=asyncHandler(async (req,res)=>{
    const {_id}=req.user;
    const {prodId}=req.body;
    const user=await User.findById(_id);
    const alreadyAdded=user.wishlist.find((id)=>id.toString()===prodId);
    //if product already to wishlist remove it from wishlist
    if(alreadyAdded){
        const user=await User.findByIdAndUpdate(_id,{$pull:{wishlist:prodId}},{new:true});
        res.json(user)
    }
    else{
        //add to wishlist
        const user=await User.findByIdAndUpdate(_id,{$push:{wishlist:prodId}},{new:true});
        res.json(user);
    }
})

//product rating
const rating=asyncHandler(async (req,res)=>{
    const {_id}=req.user;
    const {star,comment,prodId}=req.body;
    
        //with prodId find the product
        const product=await Product.findById(prodId)
        //find user already rated or not
        const alreadyRated=product.ratings.find((userId)=>userId.ratedBy.toString()===_id.toString())
        if(alreadyRated){
            const updateRating=await Product.updateOne({
                ratings:{$elemMatch:alreadyRated}},
                {$set:{"ratings.$.star":star}}
            );
          
            
        }else{
            const rateProduct=await Product.findByIdAndUpdate(prodId,{
                $push:{
                    ratings:{
                        star:star,
                        
                        ratedBy:_id,
                    },
                },
            },{new:true});
         
        }
        //find average rating of product
        //find product
        const getProduct=await Product.findById(prodId);
        //find number of user who have rated the product
        let totalUser=getProduct.ratings.length;
        //find sum of the rating
        let ratingSum=getProduct.ratings.map((item)=>item.star).reduce((prev,curr)=>prev+curr,0)
        //find average of traitng
        let averageRating=Math.round(ratingSum/totalUser);
        let finalProduct=await Product.findByIdAndUpdate(prodId,{totalRating:averageRating},{new:true});
        res.json(finalProduct)
    })

module.exports={
    createProduct,getProduct,getAllProduct,productUpdate,
    deleteProduct,addToWishlist,rating
};