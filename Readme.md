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
