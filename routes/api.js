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
    res.json(anchor.hashDict);
});

/**
 * Route for uploading a new document, and anchoring it to the blockchain
 */
router.post('/upload/', upload.any(), function (req, res) 
{
    //Check for required parameters
    if (!('name' in req.body) || req.files.length < 1) 
    {
        return res.sendStatus(400);
    }
    //Hash the file
    let hash = anchor.hashFile(req.files[0].buffer);
    //Save the document in the datastore and keep track of it's ID
    let id = anchor.saveDocument(hash, req.body.name);
    //Send a response back to the client
    res.json({id:id, hash:hash});
});

/**
 * Route for reuploading a document, and comparing it's fingerprint to the
 * fingerprint of the matching document on the blockchain
 */
router.put('/verify/', upload.any(), function (req, res) 
{
    //Check for required parameters
    if (!('id' in req.body) || req.files.length < 1) 
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
    //Send a response back to the client
    res.json({
        verifySuccess: hash === document.hash, //Check if the hashes differ
        uploadedHash: hash,
        storedHash: document.hash
    });
});

module.exports = router;
