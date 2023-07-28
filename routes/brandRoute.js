const express=require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { createBrand, updateBrand, getBrand, getAllBrand, deleteBrand } = require("../controller/brandCtrl");

const router=express.Router();

router.post("/create",authMiddleware,isAdmin,createBrand);
router.get("/all",getAllBrand);
 router.get("/:id",getBrand);
 
 router.put("/update/:id",authMiddleware,isAdmin,updateBrand);
 router.delete("/delete/:id",authMiddleware,isAdmin,deleteBrand)

module.exports=router;