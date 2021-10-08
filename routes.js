//Create the POST endpoint


//Load express and the schema created before
const express = require('express');
const documentModel = require('./models');
const app = express();



//A route to add a new document to the database
app.post('/add_document', async (request, response) =>  
{

    //Parsing the document to be saved to the database
    const document = new  documentModel(request.body);

    //This helps save the object to the database:
    try 
    {
		
        await document.save();	//Mongo query
        response.send(document);

    }
    catch(error) 
    {
        response.status(500).send(error);
    }


});

//Route to retrieve all documents in the MongoDB database
app.get('/documents', async (request, response) => 
{

    //Return all document in the Database
    const documents = await documentModel.find({}); //Mongo query

    //Send documents to this endpoint
    try 
    {
        response.send(documents);

    }
    catch(error) 
    {
        response.status(500).send(error);
    }

});

//Route to retrieve all the name, hash and _id for each document
//stored in the MongoDB database
app.get('/documentNames', async (request, response) => 
{

    //Query the collection and return only the document name, hash and unique id.
    const documents = await documentModel.find({}, { documentName: 1, documentHash: 1 }); //Mongo query

    //Send documents to this endpoint
    try 
    {
        response.send(documents);

    }
    catch(error) 
    {
        response.status(500).send(error);
    }

});

//Route to retrieve the document hash given the
//document name provided by the user. Must be in
//JSON format
app.get('/search', async (request, response) => 
{

    // searches based on the document name
    // given by the user
    var name = request.body.documentName;
	
    //Given the document name, return its associated hash.
    const documents = await documentModel.findOne( {documentName: name}, {documentHash: 1} );

    //Send documents to this endpoint
    try 
    {
        response.send(documents);

    }
    catch(error) 
    {
        response.status(500).send(error);
    }
});


//Export these endpoints:
module.exports = app;
