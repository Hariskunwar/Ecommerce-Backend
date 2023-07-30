const limiter=require("express-rate-limit")

function rateLimiter(time,maxReq,message){
    let limit=limiter({
        windowMs:time,
        max:maxReq,
        standardHeaders:true,
        legacyHeaders:false,
        message:{
            status:false,
            errorType:"Too many request",
            message:message
        }
           
    });
    return limit;
}

module.exports=rateLimiter