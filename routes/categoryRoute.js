const express=require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { createCategory, getCategory, getAllCategory, updateCategory, deleteCategory } = require("../controller/categoryCtrl");

const router=express.Router();

router.post("/create",authMiddleware,isAdmin,createCategory);
router.get("/all",getAllCategory);
 router.get("/:id",getCategory);

 router.put("/update/:id",authMiddleware,isAdmin,updateCategory);
 router.delete("/delete/:id",authMiddleware,isAdmin,deleteCategory)

module.exports=router;