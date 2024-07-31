import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

// for limiting the json data
app.use(express.json({limit:"16kb"}))
//to parse incoming requests with URL-encoded payloads. It specifies that nested objects can be handled (extended: true) and sets the maximum request body size to 16 kilobytes (limit: "16kb").
app.use(express.urlencoded({extended:true,limit:"16kb"}));//
app.use(express.static("public"));//serves static files like images from public directory.

app.use(cookieParser());//is a middleware that parses cookies attached to client request object,allows you to access and manage the cookies sent by the client.




export default app;
