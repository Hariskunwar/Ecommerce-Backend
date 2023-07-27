const express=require("express");
const { createProduct } = require("../controller/productCtrl");
const {authMiddleware,isAdmin}=require("../middleware/authMiddleware")

const router=express.Router();

//route to create new product
router.post("/new-product",authMiddleware,isAdmin,createProduct)


module.exports=router;