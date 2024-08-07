import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(()=>{
      app.listen(process.env.PORT||4000, () => {
        console.log(`App is listening at port ${process.env.PORT}`);
      })
      
     },
     app.on("error", (err) => {
      console.log("ERROR :", err);
      throw err;
    }),
   
    
  )
  .catch((err) => {
    console.log("MongoDB connection failed !!!!!", err);
  });
