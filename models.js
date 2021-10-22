//Creating the schema

const mongoose = require('mongoose');


const DocumentSchema = new mongoose.Schema({
    // Document Hash done by backend server
    documentHash: {
        type: String,
        required: true
    },
    // Time stamp retrieved from backend server
    timeStamp : {
        type: String,
        required: true
    },
    // Name of the document
    documentName : {
        type: String,
        required: true
    },
    // Hedera Topic ID
    topicId : {
        type: String,
        required: true
    },

});

//Export the schema using these lines:
const Document = mongoose.model('Document', DocumentSchema);
module.exports = Document;
