const express=require("express");
const { createProduct, getProduct, getAllProduct } = require("../controller/productCtrl");
const {authMiddleware,isAdmin}=require("../middleware/authMiddleware")

const router=express.Router();

//route to create new product
router.post("/new-product",authMiddleware,isAdmin,createProduct)

//get all product
router.get("/all-product",getAllProduct)
//route to get single product
router.get('/:id',getProduct)


module.exports=router;