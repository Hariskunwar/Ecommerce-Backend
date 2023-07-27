const express=require("express");

const dbConnect=require("./config/dbConnect");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const morgan=require("morgan")
const userRouter=require("./routes/userRoute")
const productRoute=require("./routes/productRoute")
const cookieParser=require("cookie-parser");


require("dotenv").config();

const app=express();


//connect to database
dbConnect();
//setup morgan
app.use(morgan("dev"))
//setup body parser
app.use(express.json())
//set up cookie parser
app.use(cookieParser());

//setup user routes
app.use("/api/user",userRouter)
//setup product route
app.use("/api/product",productRoute)

//setup error handler
app.use(notFound)
app.use(errorHandler)

const port=process.env.PORT||8080
app.listen(port,()=>{
    console.log(`server running at port:${port}`);
})