//Creating the connection

//Special thanks to: https://www.section.io/engineering-education/nodejs-mongoosejs-mongodb/

//Libraries
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Router = require('./routes');


const app = express();

app.use(express.json());


//Connects to our MongoDB database
mongoose.connect(process.env.MONGO_DB_ADDR);


//Error checking
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () 
{

    console.log('Connected successfully');

});


app.use(Router);

//Sets the app to listen to an arbitrary port 3000
const PORT = normalizePort(process.env.PORT || '3000');
app.listen(PORT, () => 
{
    console.log(`Server is running on port ${PORT}`);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) 
{
    var port = parseInt(val, 10);
  
    if (isNaN(port)) 
    {
        // named pipe
        return val;
    }
  
    if (port >= 0) 
    {
        // port number
        return port;
    }
  
    return false;
}

app.post;
