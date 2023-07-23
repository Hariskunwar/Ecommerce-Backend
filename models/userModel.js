const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
        },
        mobile:{
            type:String,
            unique:true
        },
        password:{
            type:String,
            required:true,
            min:6
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
},{timestamps:true}
);
module.exports=mongoose.model("User",userSchema)