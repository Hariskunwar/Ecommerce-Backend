const express=require("express");

const dbConnect=require("./config/dbConnect")
require("dotenv").config();

const app=express();

//connect to database
dbConnect();


const port=process.env.PORT||8080
app.listen(port,()=>{
    console.log(`server running at port:${port}`);
})