const mongoose=require("mongoose")
const bcrypt=require("bcrypt")

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
},
{timestamps:true}
);

userSchema.pre('save',async function (next){
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
    next();
})


module.exports=mongoose.model("User",userSchema)