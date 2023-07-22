const mongoose=require("mongoose");

async function dbConnect(){
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION)
        console.log("database connected");
    } catch (error) {
      console.log(error);  
    }
}
module.exports=dbConnect;