const express=require("express");
const { createProduct, getProduct } = require("../controller/productCtrl");
const {authMiddleware,isAdmin}=require("../middleware/authMiddleware")

const router=express.Router();

//route to create new product
router.post("/new-product",authMiddleware,isAdmin,createProduct)


//route to get single product
router.get('/:id',getProduct)

module.exports=router;