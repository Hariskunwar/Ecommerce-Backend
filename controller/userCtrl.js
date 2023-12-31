const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/jwtToken");
const crypto=require("crypto");
const sendEmail = require("./emailCtrl");
const generateRefreshToken=require("../utils/refreshToken")
const jwt=require("jsonwebtoken")
const Product=require("../models/productModel")
const Cart=require("../models/cartModel");
const Coupon=require("../models/couponModel");
const Order=require("../models/oderModel")
const uniqid=require("uniqid")


//register a user
const registerUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    //check user already exist with email,as email is unique
    const findUser = await User.findOne({ email: email })
    //if already not exist then create user
    if (!findUser) {
        const createUser = await User.create(req.body);
        res.status(201).json(createUser);
    }
    //if user exist with email
    else {
        res.status(400);
        throw new Error("User already exist")
    }
});

//user login 
const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //first check user exist or not with the help of email
    const user = await User.findOne({ email: email });
    //if user found and password matched, generate token
    if (user && (await user.isPasswordMatched(password))) {
        const refreshToken=await generateRefreshToken(user.id)
        const updateUser=await User.findByIdAndUpdate(user.id,
            {refreshToken:refreshToken},{new:true});
            
            res.cookie("refreshToken",refreshToken,{httpOnly:true,maxAge:72*60*60*1000});

        res.status(200).json({
            username: user?.name,
            token: generateToken(user?._id)
        })
    } else {
        res.status(401);
        throw new Error("Invalid credentials")
    }
})

//handle refresh token
const handleRefresToken=asyncHandler(async (req,res)=>{
    const cookie=req.cookies;
    if(!cookie){
        res.status(401);
        throw new Error("no refresh token in cookie");
    } 
    const refreshToken=cookie.refreshToken;
    const user=await User.findOne({refreshToken:refreshToken});
    if(!user) {
        res.status(403)
        throw new Error("refresh token not matched")
    }
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if(err||user.id!==decoded.id) throw new Error("something went wrong with refresh token");
        const accessToken=generateToken(user._id)
        res.json({accessToken});
    })

})

//logout functionality

const logout=asyncHandler(async (req,res)=>{
    const cookie=req.cookies;
    if(!cookie?.refreshToken) throw new Error("No refresh token in cookies")
    const refreshToken=cookie.refreshToken;
    const user=await User.findOne({refreshToken});
    if(!user){
        res.clearCookie('refreshToken',{httpOnly:true, secure:true});
        res.sendStatus(204); 
    }
    await User.findOneAndUpdate({refreshToken},{refreshToken:" "});
    res.clearCookie("refreshToken",{httpOnly:true,secure:true});
    res.sendStatus(204)

})

//get all user
const getAllUser = asyncHandler(async (req, res) => {
    const allUser = await User.find()
    const users = allUser.map((user) => ({
        userId: user._id,
        username: user.name,
        email: user.email,
        mobile: user.mobile
    }))
    res.status(200).json(users)
})

//get single user
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({
        userId: user._id,
        username: user.name,
        email: user.email,
        mobile: user.mobile,
        isAdmin: user.isAdmin,
        registerationDate: user.createdAt,
        isBlocked:user.isBlocked
    })
})

//user profile update
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile
    }, { new: true })
    res.status(200).json({
        userId: user._id,
        username: user.name,
        email: user.email,
        mobile: user.email
    })
})

//user deletion
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const adminDeleteUser=await User.findById(id)
    const user = req.user
  
    
        if (id && !adminDeleteUser.isAdmin) {
            //admin deletes a specific user account
            await User.findByIdAndDelete(id);
            res.status(200).json("User account  deleted succussfully ")
        }
        else if (!user.isAdmin) {
            //user deleting their own account
            await User.findByIdAndDelete(user._id)
            res.status(200).json("Your account deleted successfully")
        }
        else{
            res.status(403)
            throw new Error('You are not authorized to delete this account')
        }

    });

    //block user
    const blockUser=asyncHandler(async (req,res)=>{
        const {id}=req.params;
        const block=await User.findByIdAndUpdate(id,{isBlocked:true},{new:true})
        res.status(200).json({message:"user blocked successfully"})
    })

    //unblock user
    const unBlockUser=asyncHandler(async (req,res)=>{
        const {id}=req.params;
        const unblock=await User.findByIdAndUpdate(id,{isBlocked:false},{new:true})
        res.status(200).json({message:"user unblocked successfully"})
    });

    //update password 
    const updatePassword=asyncHandler(async (req,res)=>{
        const {_id}=req.user;
        const {password}=req.body;
        const user=await User.findById(_id)
        if(user&&password&&(await user.isPasswordMatched(password))){
            res.status(400)
            throw new Error("please provide new password instead of old")

        }else{
            user.password=password;
            await user.save();
            res.status(200).json("password update succussfully");
        }
    })

    //generate forget password token
    const forgetPasswordToken=asyncHandler(async (req,res)=>{
        const {email}=req.body;
        const user=await User.findOne({email:email});
        if(!user){
            res.status(404)
            throw new Error("User not exist with this email");
        }
        const token=await user.createPasswordResetToken();
        await user.save();
        const resetLink=`http://localhost:8080/api/user/reset-password/${token}`;
        let data={
            to:email,
            text:`Hello ${user.name}`,
            subject:"forget password",
            html:resetLink

        }
        sendEmail(data)
        res.status(200).json(resetLink)
    });

    //reset password using token
    const resetPassword=asyncHandler(async (req,res)=>{
        const {password}=req.body;
        const {token}=req.params;
        const hashedToken=crypto.createHash("sha256").update(token).digest("hex");
        const user=await User.findOne({passwordResetToken:hashedToken,passwordResetTokenExpires:{$gt:Date.now()}});
        if(!user){
            res.status(403);
            throw new Error("token expired, please send request for new token");
        }
        user.password=password;
        user.passwordResetToken=undefined;
        user.passwordResetTokenExpires=undefined;
        await user.save();
        res.status(200).json("password reset successful");
    });

    //get user wishlist
    const getWishlist=asyncHandler(async (req,res)=>{
        const {_id}=req.user;
        const findUser=await User.findById(_id).populate("wishlist")
        res.json(findUser);
    })

    //create user cart
    const userCart=asyncHandler(async (req,res)=>{
        const {cart}=req.body;
        const {_id}=req.user;
        let products=[];
        const user=await User.findById(_id);
        //check if user already have product in cart
        const alreadyExistCart=await Cart.findOne({orderBy:user._id})
        if(alreadyExistCart)  throw new Error("First empty the cart")
        for(let i=0;i<cart.length;i++){
            let object={}
            object.product=cart[i].id;
            object.count=cart[i].count;
            object.color=cart[i].color;
            let getPrice=await Product.findById(cart[i].id).select("price").exec();
            object.price=getPrice.price;
            products.push(object);

        }
        //calculate cart total
        let cartTotal=0;
        for(let i=0;i<products.length;i++){
            cartTotal=cartTotal+products[i].price*products[i].count;
        }
        //save cart to database
        let newCart=await new Cart({products,cartTotal:cartTotal,orderBy:user._id}).save();
        res.json(newCart)
    });

    //get user cart
    const getUserCart=asyncHandler(async (req,res)=>{
        const {_id}=req.user;
        const cart=await Cart.findOne({orderBy:_id}).populate("products.product");
        res.json(cart)
    })
    //make cart empty
    const emptyCart=asyncHandler(async (req,res)=>{
        const {_id}=req.user;
        const user=await User.findById(_id);
        await Cart.findOneAndRemove({orderBy:user._id});
        res.json("cart is empty");
    }); 

    //apply coupon to cart
    const applyCoupon=asyncHandler(async (req,res)=>{
        const {coupon}=req.body;
        const {_id}=req.user;
        const validCoupon=await Coupon.findOne({name:coupon});
      if(validCoupon==null ) throw new Error("Invalid coupon");
      const user=await User.findOne({_id});
      let {products,cartTotal}=await Cart.findOne({orderBy:user._id}).populate("products.product");
      let totalAfterDiscount=(cartTotal-(cartTotal*validCoupon.discount)/100).toFixed(2);
      await Cart.findOneAndUpdate({orderBy:user._id},{totalAfterDiscount:totalAfterDiscount});
      res.json(totalAfterDiscount)
    });

    //create order
    const createOrder=asyncHandler(async (req,res)=>{
        const {COD,couponApplied}=req.body;
        const {_id}=req.user;
        if(!COD) throw new Error("order failed");
        const user=await User.findById(_id);
        const userCart=await Cart.findOne({orderBy:user._id});
        let finalAmount=0;
        if(couponApplied&&userCart.totalAfterDiscount){
            finalAmount=userCart.totalAfterDiscount
        }else{
            finalAmount=userCart.cartTotal;
        }
        let newOrder=await new Order({
            products:userCart.products,
            paymentIntent:{
                id:uniqid(),
                method:"COD",
                amount:finalAmount,
                status:"Cash On Delivery",
                created:Date.now(),
                currency:"NPR"
            },
            orderBy:user._id,
            orderStatus:"Processing"
        }).save();
        //decrease the product quantity and increases the sold quantity
        let update=userCart.products.map((item)=>{
            return{updateOne:{
                filter:{_id:item.product._id},
                update:{$inc:{quantity:-item.count,sold:+item.count}}
            }}
        });
    const updated=await Product.bulkWrite(update,{});
    res.json("success");
    })

    //get all oder
    const getAllOrder=asyncHandler(async (req,res)=>{
        const getOrders=await Order.find()
        res.json(getOrders)
    })

    //get a  order
    const getOrder=asyncHandler(async (req,res)=>{
        const {_id}=req.user;
        const order=await Order.findOne({orderBy:_id}).populate("products.product");
        res.json(order)
    })

    //update user order
    const updateOrderStatus=asyncHandler(async (req,res)=>{
        const {status}=req.body
        const {id}=req.params;
        const findOrder=await Order.findByIdAndUpdate(id,{oderStatus:status},{new:true})
        res.json(findOrder)
    })


module.exports = {
    registerUser, userLogin, getAllUser, getUser, updateUser, deleteUser,
    blockUser,unBlockUser,updatePassword,forgetPasswordToken,resetPassword,
    handleRefresToken,logout,getWishlist,userCart,getUserCart,emptyCart,applyCoupon,
    createOrder,getAllOrder,getOrder,updateOrderStatus
}