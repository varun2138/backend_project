import { v2 as cloudinary  } from "cloudinary";
import fs from "fs";


//configuration

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});


//file upload on cloudinary
const uploadOnCloudinary= async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
    //upload the file on cloudinary
    const response= await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"   
    });
    //file has been uploaded successfully
    console.log("fle is uploaded on cloudinary",response.url);
    return response;
    } catch (error) {
        fs.unlink(localFilePath)// removes the locally saved temporary file as the upload operation got failed
         return null;        
    }

    

}

export default uploadOnCloudinary;