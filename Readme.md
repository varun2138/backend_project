#Backend Project

//setup a proffesional backend
//command-->npm init
//add a readme file
//add a "public" folder and a "temp" folder inside it and create a "gitKeep" file in it to push the folder to github , as empty folder doesnot considered at github repository
//create an "env" file for securing the details regarding the port number and api key
//create an "src" folder and add "index", "app", "constants" js files inside it
//create a "gitignore" file
//install "nodemon" rather than using node , which needs to be restarted every time.
//install "prettier"
//add "module" in the package.json file

Learning backend by building project

//code for database connection - first approach

/\*
import express from "express";
const app = express();

(async () => {
try {
await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
app.on("error", (error) => {
console.log("ERROR :", error);
throw error;
});
app.listen(process.env.PORT, () => {
console.log(` App is listening at port ${process.env.PORT}`);
});
} catch (error) {
console.error("ERROR :", error);
throw error;
}
})();
\*/

//definitions

**middleware**
Middlewares in Express.js are functions that process requests and responses, handling tasks like authentication, logging, and parsing.
 diagram-->https://developer.okta.com/assets-jekyll/blog/express-middleware-examples/middleware-30b3b30ad54e21d8281719042860f3edd9fb1f40f93150233a08165d908f4631.png

**cookie-parser**
#cookie-parser is a middleware for Express.js that parses cookies attached to the client request object. This allows you to access and manage the cookies sent by the client in your Express application. You can use it to easily read, write, and manipulate cookies.

**cors**
cors is a middleware for Express.js that enables Cross-Origin Resource Sharing (CORS), allowing your server to accept requests from different origins. By default, web browsers block requests made to a domain different from the one that served the web page, but with CORS, you can specify which domains are allowed to access your resources.