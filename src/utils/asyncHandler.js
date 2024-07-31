const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((error)=>next(error));
    }
};







export default asyncHandler;








// method-1
/*const asyncHandlerr=(fn)=async(req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
     res.status(error.code || 500).json({
        success:false,
        message:error.message
     })
    }
}*/

