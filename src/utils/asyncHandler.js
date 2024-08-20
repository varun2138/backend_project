const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

/*
asyncHandler ensures that
 all asynchronous errors are consistently passed
  to your error-handling middleware.
   This way, you don't accidentally 
   forget to catch errors in some of your routes

*/

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
