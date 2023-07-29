const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        lowercase:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        default:0
    },
    sold:{
        type:Number,
        default:0
    },
    images:Array,
    color:{
        type:String,
        required:true
    },
    ratings:[{
        star:Number,
        ratedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }],
    totalRating:{
        type:Number,
        default:0
    },
},
{timestamps:true}
);



module.exports=mongoose.model("Product",productSchema)