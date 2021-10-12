const crypto = require('crypto');
require('dotenv').config();
const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, FileContentsQuery, FileId, TopicCreateTransaction, TopicMessageSubmitTransaction, getMessage, TopicMessageQuery, TopicId, getAdminKey, getSubmitKey, transaction} = require('@hashgraph/sdk');


//Tempoary dictionary for storing documents
//All refrerences to be replaces with database queries
var hashDict = [];

/**
 * Retreives the list of all documents which have been uploaded
 * @returns Array of all known documents
 */
function getAllDocuments() 
{
    return hashDict;
}

/**
 * Retreives document information from the datastore
 * @param {string} id The ID of the document to search for
 * @returns document info if found, else null
 */
function findDocument(id) 
{
    //Search all entries
    for (const idx in hashDict) 
    {
        const entry = hashDict[idx];
        //Check if this entry matches
        if (entry.id === id) 
        {
            return entry;
        }
    }
    //If none were found, return null
    return null;
}

/**
 * Saves a document into the datastore
 * @param {string} hash The hash to be stored
 * @returns The generated ID of the document
 */
function saveDocument(hash, name) 
{
    //Generate a new unique ID
    let id = generateuid();
    //Add the document to the datastore
    hashDict.push({ name: name, id: id, hash: hash });
    //Return the generated ID
    return id;
}

/**
 * Submits a document into the blockchain
 * @param {string} hash The hash to be submitted, name of document
 * @returns The topicID of the transaction
 */
async function submitDocument(hash, name)
{
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;
    console.log('Private key is ' + myPrivateKey);

    if (myAccountId == null || myPrivateKey == null ) 
    {
        throw new Error('Environment variables myAccountId and myPrivateKey must be present');
    }

    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);
    client.setMaxTransactionFee(new Hbar(0.1));

    //Create the transaction
    const transaction =  new TopicCreateTransaction().setTopicMemo(name);

    //Sign with the client operator private key and submit the transaction to a Hedera network
    const txResponse =  await transaction.execute(client);

    //Request the receipt of the transaction
    const receipt =  await txResponse.getReceipt(client);

    console.log(receipt);

    new TopicMessageSubmitTransaction({
        topicId: receipt.topicId,
        message: hash
    }).execute(client); 

    return receipt.topicId;
}

/**
 * retrieves the hash of a document from the blockchain
 * @param {string} topic id of the document
 * @returns The topicID of the transaction
 */
async function retrieveHash(topicId, callback) 
{
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;
    console.log('Private key is ' + myPrivateKey);

    if (myAccountId == null || myPrivateKey == null ) {
        throw new Error('Environment variables myAccountId and myPrivateKey must be present');
    }

    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);
    client.setMaxTransactionFee(new Hbar(0.1));

    const topicNum = topicId.slice(4);
    const newTopicId = new TopicId(0,0,topicNum);

    let hash = null;
    new TopicMessageQuery()
        .setTopicId(newTopicId)
        .setStartTime(0)
        .setLimit(1)
        .subscribe(
            client,
            (message) => {
                let hash = Buffer.from(message.contents, "utf8").toString();
                callback(hash)
            }
            );
}

/**
 * Generates a unique id for use in the datastore
 * @returns A unique ID
 */
function generateuid() 
{
    //Generate a new ID
    let id = crypto.randomBytes(16).toString('hex');
    //Check if it is in use
    while (findDocument(id) !== null) 
    {
        //Generate a new ID
        id = crypto.randomBytes(16).toString('hex');
    }
    //Return the ID
    return id;
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
    hashFile: hashFile,
    submitDocument: submitDocument,
    retrieveHash: retrieveHash
};

//(async() => { 
  //  console.log("Topic Id is " + await submitDocument("hash", "name of document")) } )()

//retrieveHash()