const debug = require('debug')('blockchain-4:anchoring');
const crypto = require('crypto');
//const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, FileContentsQuery, FileId, TopicCreateTransaction, TopicMessageSubmitTransaction, getMessage, TopicMessageQuery, TopicId, getAdminKey, getSubmitKey, transaction} = require('@hashgraph/sdk');
const { Client, Hbar, TopicCreateTransaction, TopicMessageSubmitTransaction, TopicMessageQuery, TopicId} = require('@hashgraph/sdk');
const mongoose = require('mongoose');
const documentModel = require('./models');


//Retrieving configuration info from .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;
const mongoAddr = process.env.MONGO_DB_ADDR;

//Check required variables exist
if (myAccountId == null || myPrivateKey == null || mongoAddr == null ) 
{
    throw new Error('Environment variables MY_ACCOUNT_ID, MY_PRIVATE_KEY and MONGO_DB_ADDR must be present');
}

//Establish Hedera client
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);
client.setMaxTransactionFee(new Hbar(0.1));

//Connect to our MongoDB database
mongoose.connect(mongoAddr);
//Error checking
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () 
{
    debug('Mongoose Connected successfully');
});

/**
 * Retreives the list of all documents which have been uploaded
 * @returns Array of all known documents
 */
async function getAllDocuments() 
{
    //Query MongoDB for all stored documents
    const documents = await documentModel.find({}, { documentName: 1 });
    let allDocuments = [];
    
    debug(`Found ${documents.length} documents in database`);

    //Refactoring list of documents
    for (const document of documents)
    {
        allDocuments.push({name: document.documentName, id: document._id});
    }

    return allDocuments;
}

/**
 * Saves a document into the datastore
 * @param {string} hash The hash to be stored
 * @returns The generated ID of the document
 */
async function saveDocument(hash, name) 
{
    //Submit hash to Hedra
    const topicId = await submitDocumentHedra(hash, name);
    debug(`Hash ${hash} sent to Hedra, topicID ${topicId}`);
    //Add the document to the datastore
    let document = new  documentModel({anchorinfo:topicId, documentName: name, Timestamp:Date.now(), documentHash: hash});
    await document.save();	//Mongo query
    debug(`Document stored in database, ID ${document._id}`);
    //Return the generated ID
    return document._id;
}

/**
 * Submits a document into the blockchain
 * @param {string} hash The hash to be submitted, name of document
 * @returns The topicID of the transaction
 */
async function submitDocumentHedra(hash, name)
{
    //Create the transaction
    const transaction =  new TopicCreateTransaction().setTopicMemo(name);

    //Sign with the client operator private key and submit the transaction to a Hedera network
    const txResponse =  await transaction.execute(client);

    //Request the receipt of the transaction
    const receipt =  await txResponse.getReceipt(client);

    new TopicMessageSubmitTransaction({
        topicId: receipt.topicId,
        message: hash
    }).execute(client); 

    return receipt.topicId;
}

/**
 * Retreives document information from the datastore
 * @param {string} id The ID of the document to search for
 * @returns document info if found, else null
 */
async function findDocument(id) 
{
    //Search database
    try 
    {
        const document = await documentModel.findOne({_id: id}, {anchorinfo: 1});
    
        debug(`Document Found: ${id}, Hedra Topic ID: ${document.anchorinfo}`);
    
        let retrievedHash = await retrieveHashHedra(document.anchorinfo);
        debug('retrievedHash:', retrievedHash);
        return retrievedHash;
    }
    catch (error) 
    {
        debug('Error retreiving document:', id);
        return null;
    }
}

/**
 * retrieves the hash of a document from the blockchain
 * @param {string} topic id of the document
 * @returns The topicID of the transaction
 */
function retrieveHashHedra(topicId) 
{   
    return new Promise((resolve, reject) =>
    {
        //created topic Id object with num passed into function
        const topicNum = topicId.slice(4);
        const newTopicId = new TopicId(0, 0, topicNum);

        //subscribes to hedera mirror node and returns first message in topic
        try 
        {
            new TopicMessageQuery()
                .setTopicId(newTopicId)
                .setStartTime(0)
                .setLimit(1)
                .subscribe(
                    client,
                    (message) => 
                    {
                        let hash = Buffer.from(message.contents, 'utf8').toString();
                        resolve(hash);
                    }
                );
        }
        catch (error) 
        {
            reject(error);
        }
        
    });
}

/**
 * Hashes a file
 * @param {Buffer} file The file to be hashed
 * @returns Hex representation of file hash
 */
function hashFile(file) 
{
    //Create hashing object -> Add the file to be hashed -> Get hex representation
    return crypto.createHash('sha256').update(file).digest('hex');
}

//module.exports is available in other files using require(...)
module.exports = {
    getAllDocuments: getAllDocuments,
    findDocument: findDocument,
    saveDocument: saveDocument,
    hashFile: hashFile
};
