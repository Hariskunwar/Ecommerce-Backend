const express=require("express");

const dbConnect=require("./config/dbConnect");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

require("dotenv").config();

const app=express();

//connect to database
dbConnect();


app.use(notFound)
app.use(errorHandler)

const port=process.env.PORT||8080
app.listen(port,()=>{
    console.log(`server running at port:${port}`);
})