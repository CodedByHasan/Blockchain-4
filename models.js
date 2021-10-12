//Creating the schema

const mongoose = require('mongoose');


const DocumentSchema = new mongoose.Schema({
    
    documentHash: {
        type: String,
        required: true
    },
    
    Timestamp : {
        type: String,
    },

    documentName : {
        type: String,
        required: true
    },
    anchorinfo : {
        type: String,
        required: true
    },

});

//Export the schema using these lines:
const Document = mongoose.model('Document', DocumentSchema);
module.exports = Document;
