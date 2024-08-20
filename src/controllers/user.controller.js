import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while genarating access and refresh token"
    );
  }
};


/*
STEPS TO CREATE USER REGISTER

1--> Get the details from the frontend
2--> Validate the details - not empty
3-->Check if user is already signed-In or not
4-->Check for images, check for avatar
5-->Upload the avatar in cloudinary, and throw error if not uploaded
6-->Create user object- create an entry in db
7-->Remove password and refresh token from the response
8-->Check the user creation
9-->Return the response

*/

const userRegister = asyncHandler(async (req, res) => {
  // 1-->
  const { fullName, username, email, password } = req.body;

  // 2-->
  if (
    [fullName, username, email, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  // 3-->
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with username and email already exists");
  }

  // 4-->
  // console.log("request for files:", req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 5-->
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 6-->
  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // 7-->
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // 8-->
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  // 9-->
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

/* 
STEPS TO CREATE USER LOGIN

1-->details from req body-data
2-->username or email
3-->find the user
4-->password check
5-->access and refresh token
6-->send cookies
7--> return response
*/

const loginUser = asyncHandler(async (req, res) => {
  //1--> destructuring the data from body-data
  const { username, email, password } = req.body;

  //2--> check the details are entered or not if not, throw the error
  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  //3--> find the user exists or not
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  // throw error if user doesnot exist
  if (!user) {
    throw new ApiError(404, "User doesnot exist");
  }

  //4-->check if the password is correct or not
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect");
  }

  //5--> access and refresh token
  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser= await User.findById(user._id).
   select("-password -refreshToken")

   const options={
    httpOnly:true,
    secure:true 
   };
   //6-->
   return res
     .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse(
        200,
        {
          user:loggedInUser,accessToken,
          refreshToken
        },
        "User logged in successfully"
      )
    )     

});


const logoutUser=asyncHandler(async (req,res)=>{
   await User.findByIdAndUpdate(
      req.user._id,
      {
        $set:{
          refreshToken:undefined
        }
      }
    )
    const options={
      httpOnly:true,
      secure:true 
    }
    return res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200,{},"User logged Out"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=  req.cookies.refreshToken ||req.body.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
  }
try {
  const decodedToken=   jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
  const user=await User.findById(decodedToken?._id)
  if(!user){
    throw new ApiError(401,"invalid refresh token");
  }
  if(incomingRefreshToken !==user?.refreshToken){
    throw new ApiError(401,"  refresh token is expired or used");
  
  }
  const options={
    httpOnly:true,
    secure:true 
  }
  
  const{newRefreshToken,accessToken}=await generateAccessAndRefreshTokens(user._id);
  return res
  .status(200)
  .cookie("accessToken",accessToken,options  )
  .cookie("refreshToken",newRefreshToken,options)
  .json(
    new ApiResponse(
      200,
      {accessToken,refreshToken:newRefreshToken},
      "Access token refreshed"
    )
  )
} catch (error) {
  throw new ApiError(401,error?.message||"invalid refresh token  ")
}

})

export { userRegister, loginUser,logoutUser,refreshAccessToken };
 

///////////////////////////////////////////////
/* 
  By using asyncHandler,
 you ensure that any asynchronous
 errors in the userRegister function
 are properly handled, preventing
 uncaught exceptions and making error handling
 more consistent across your application.
*/
