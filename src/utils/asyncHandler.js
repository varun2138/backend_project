const asyncHandler=(requestHandler)=>{
   return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((error)=>next(error));
    }
};



// By using asyncHandler,
// you ensure that any asynchronous
// errors in the userRegister function
// are properly handled, preventing
// uncaught exceptions and making error handling
// more consistent across your application.






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

