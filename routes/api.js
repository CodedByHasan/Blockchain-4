var express = require('express');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const anchor = require('../anchoring');

var router = express.Router();

/**
 * Route for getting a list of all previously uploaded and anchored documents
 */
router.get('/list/', function (req, res) 
{
    res.json(anchor.getAllDocuments());
});

/**
 * Route for uploading a new document, and anchoring it to the blockchain
 */
router.post('/upload/', upload.any(), async function (req, res) 
{
    //Check for required parameters
    if (!('name' in req.body) || req.body.name.length < 1 || req.files.length < 1) 
    {
        return res.sendStatus(400);
    }
    //Hash the file
    let hash = anchor.hashFile(req.files[0].buffer);

    let topicId = await anchor.submitDocument(hash, req.body.name);
    await console.log('topic id is:' + topicId);
    
    //Save the document in the datastore and keep track of it's ID
    let id = anchor.saveDocument(hash, req.body.name);


    //Send a response back to the client
    res.json({id:id, hash:hash});
    
});

/**
 * Route for reuploading a document, and comparing it's fingerprint to the
 * fingerprint of the matching document on the blockchain
 */
router.put('/verify/', upload.any(), async function (req, res) 
{
    //Check for required parameters
    if (!('id' in req.body) || req.body.id.length < 1 || req.files.length < 1) 
    {
        return res.sendStatus(400);
    }
    //Find the document in the datastore
    let document = anchor.findDocument(req.body.id);
    //Check if we know about the document ID
    if (document === null) 
    {
        return res.sendStatus(404);
    }
    //Hash the file
    let hash = anchor.hashFile(req.files[0].buffer);

    anchor.retrieveHash("0.0.2812198", function(retrievedHash) {    
        res.json({
        verifySuccess: hash === retrievedHash, //Check if the hashes differ
        uploadedHash: hash,
        storedHash: retrievedHash
    });} );

});

module.exports = router;
