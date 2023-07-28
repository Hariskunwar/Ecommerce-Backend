const express=require("express");
const { createProduct, getProduct, getAllProduct, productUpdate, deleteProduct, addToWishlist } = require("../controller/productCtrl");
const {authMiddleware,isAdmin}=require("../middleware/authMiddleware");

const router=express.Router();

//route to create new product
router.post("/new-product",authMiddleware,isAdmin,createProduct)

//add to wishlist route
router.put("/add-wishlist",authMiddleware,addToWishlist)

//get all product
router.get("/all-product",getAllProduct)
//route to get single product
router.get('/:id',getProduct)

//product update route
router.put("/:id",authMiddleware,isAdmin,productUpdate)
//add to wishlist route
router.put("/add-wishlist",authMiddleware,addToWishlist)
//product delete route
router.delete("/:id",authMiddleware,isAdmin,deleteProduct)


module.exports=router;