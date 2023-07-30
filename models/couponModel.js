const mongoose=require("mongoose");


const couponSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        uppercase:true
    },
    expires:{
        type:Date,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
})
module.exports=mongoose.model("Coupon",couponSchema);