import asyncHandler from "../utils/asyncHandler.js";

const userRegister = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

export default userRegister;

/* 
asyncHandler ensures that
 all asynchronous errors are consistently passed
  to your error-handling middleware.
   This way, you don't accidentally 
   forget to catch errors in some of your routes

*/
