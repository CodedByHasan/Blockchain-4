//Creating the schema

const mongoose = require('mongoose');


const DocumentSchema = new mongoose.Schema({


    documentId: {
        type: String,  //detail this later, right now focusing on establishing connection
        required: true,
    },

    documentHash: {
        type: String,
    },
    
    Timestamp : {
        type: String,
    },

    documentName : {
        type: String,
    },
    anchorinfo : {
        type: String,
    },

});

//Export the schema using these lines:
const Document = mongoose.model('Document', DocumentSchema);
module.exports = Document;
