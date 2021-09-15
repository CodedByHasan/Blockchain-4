//Creating the connection

//Special thanks to: https://www.section.io/engineering-education/nodejs-mongoosejs-mongodb/

//Libraries
const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes");


const app = express();

app.use(express.json());


//Connects to our MongoDB database
mongoose.connect(

'mongodb+srv://dbUser:dbUserPassword@cluster0.eprvg.mongodb.net/test?retryWrites=true&w=majority)',

);


//Error checking
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {

	console.log("Connected successfully");

});


app.use(Router);

//Sets the app to listen to an arbitrary port 3000
app.listen(3000, () => {
	console.log("Server is running at port 3000");
});

app.post