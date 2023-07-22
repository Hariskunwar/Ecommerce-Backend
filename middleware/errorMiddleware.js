

//middlwware to handle access to undefined routes in aapplication
const notFound=(req,res,next)=>{
    const error=new Error(`Requested route ${req.originalUrl} not found`)
    res.status(404)
    next(error)
}

//custom error handler
const errorHandler=(err,req,res,next)=>{
    const statusCode=res.statusCode?res.statusCode:500;
    res.status(statusCode);
    res.json({
        msg:err?.message,
        stack:err?.stack
    })
}

module.exports={notFound,errorHandler}