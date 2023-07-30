const mongoose=require("mongoose");

const orderSchema=new mongoose.Schema({
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            count:Number,
            color:String
        }
    ],
    paymentIntent:{},
    oderStatus:{
        type:String,
        default:"Not Processed",
        enum:["Not Processed","Processing","Cash On Delivery","Dispatched","Cancelled","Delivered"]
    },
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
},{timestamps:true});

module.exports=mongoose.model("Order",orderSchema)