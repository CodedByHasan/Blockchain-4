var express = require('express');
var router = express.Router();

/**
 * Route for getting a list of all previously uploaded and anchored documents
 */
router.get('/list/', function(req, res, next) {
    res.json([]); //TODO
});

/**
 * Route for uploading a new document, and anchoring it to the blockchain
 */
router.post('/upload/', function(req, res, next) {
    res.sendStatus(501); //TODO
});

/**
 * Route for reuploading a document, and comparing it's fingerprint to the
 * fingerprint of the matching document on the blockchain
 */
router.put('/verify/', function(req, res, next) {
    res.sendStatus(501); //TODO
});

module.exports = router;
