//Create the POST endpoint


//Load express and the schema created before
const express = require("express");
const documentModel = require("./models");
const app = express();



//A route to add a new document to the database
app.post("/add_document", async (request, response) =>  {

	//Parsing the document to be saved to the database
	const document = new  documentModel(request.body);

	//This helps save the object to the database:
	try {
		
		await document.save();	//Mongo query
		response.send(document);

	} catch(error) {
		response.status(500).send(error);
	}


});

//Route to retrieve all documents saved using the /add_document route
app.get("/documents", async(request, response) => {

	//Collect these documents from the database
	const documents = await documentModel.find({}); //Mongo query

//Send documents to this endpoint
	try {
		response.send(documents);

	} catch(error) {
		response.status(500).send(error);
	}

});

//Export these endpoints:
module.exports = app;
