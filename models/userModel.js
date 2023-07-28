const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const crypto=require("crypto")

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
        isBlocked:{
            type:Boolean,
            default:false
        },
        passwordResetToken:String,
        passwordResetTokenExpires:Date,
        refreshToken:String,
        wishlist:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }],
},
{timestamps:true}
);

userSchema.pre('save',async function (next){
    if(!this.isModified("password")){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})

userSchema.methods.isPasswordMatched=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

//make a schema method that will generate reset token related to user
userSchema.methods.createPasswordResetToken=async function(){
    const resetToken=crypto.randomBytes(32).toString("hex");
    this.passwordResetToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetTokenExpires=Date.now()+10*60*1000;
    return resetToken;
}

module.exports=mongoose.model("User",userSchema)