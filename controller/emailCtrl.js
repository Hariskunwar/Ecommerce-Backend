const nodemailer=require("nodemailer");
const asyncHandler=require("express-async-handler")

const sendEmail=asyncHandler(async (data,req,res)=>{
    //create transporter
    let transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    });
    let info=await transporter.sendMail({
        from:"kunwarharish@gmail.com",
        to:data.to,
        subject:data.subject,
        text:data.text,
        html:data.html
    });
    console.log("message send:",info.messageId);
    console.log("preview url",nodemailer.getTestMessageUrl(info));
});

module.exports=sendEmail;