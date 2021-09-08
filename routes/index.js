var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, FileContentsQuery, FileId, TopicCreateTransaction, TopicMessageSubmitTransaction, getMessage, TopicMessageQuery} = require("@hashgraph/sdk");
require("dotenv").config();

const prompt = require('prompt-sync')();

async function main() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    const client = Client.forTestnet()
    client.setOperator(myAccountId, myPrivateKey);
    client.setMaxTransactionFee(new Hbar(0.1));

    //collect contents of netowrk address list and print them in terminal
    const fileQuery = new FileContentsQuery()
        .setFileId( FileId.fromString("102"));
    const contents = await fileQuery.execute(client);
    //console.log(contents.toString())


    //Create the transaction
    const transaction = new TopicCreateTransaction()

    //Sign with the client operator private key and submit the transaction to a Hedera network
    const txResponse = await transaction.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the topic ID
    const newTopicId = receipt.topicId;

    console.log("The new topic ID is " + newTopicId);

    new TopicMessageQuery()
        .setTopicId(newTopicId)
        .setStartTime(0)
        .subscribe(
            client,
            (message) => console.log(Buffer.from(message.contents, "utf8").toString())
        );


    await new TopicMessageSubmitTransaction({
        topicId: receipt.topicId,
        message: "Hello World"
    }).execute(client);

    await new TopicMessageSubmitTransaction({
        topicId: receipt.topicId,
        message: "Hello Australia"
    }).execute(client); 


    testMessage = prompt('what would you like to send to the blockchain:');

    while (testMessage != "q") {
        await new TopicMessageSubmitTransaction({
            topicId: receipt.topicId,
            message: testMessage
        }).execute(client); 

        testMessage = prompt('what would you like to send to the blockchain:');
    }
    /*
    console.log("Beginning test process");

    axios.post('http://0.0.0.0:8080/v1/action',{
        "payload": "testpayload123",
        "submit": "direct"
    })
    .then((response) => {
    console.log("POST request succeeded with status text %s and data:", response.statusText);
    console.log(response.data);
    }, (error) => {
    console.log(error);
    });

    axios.get('http://0.0.0.0:8080/v1/action/?payload=' + 'testpayload123',{
    })
    .then((response) => {
    console.log("GET request 1 succeeded with status text %s and data:", response.statusText);
    console.log(response.data);
    }, (error) => {
    console.log("GET request 1 failed with error %s", error.response.statusText);
    });

    axios.get('http://0.0.0.0:8080/v1/action/?payload=randomgibberish',{
    })
    .then((response) => {
    console.log("GET request 2 succeeded with status text %s and data", response.statusText);
    console.log(response.data);
    }, (error) => {
    console.log("GET request 2 failed with error %s", error.response.statusText);
    });
    */




    /*// Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    //Create new keys
    const newAccountPrivateKey = await PrivateKey.generate(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    //Create a new account with 1,000 tinybar starting balance
    const newAccountTransactionResponse = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);
  
    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log("The new account ID is: " +newAccountId);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");

    //Create the transfer transaction
    const transferTransactionResponse = await new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000))
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000))
        .execute(client);

    //Verify the transaction reached consensus
    const transactionReceipt = await transferTransactionResponse.getReceipt(client);
    console.log("The transfer transaction from my account to the new account was: " + transactionReceipt.status.toString());

    //Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The account balance after the transfer is: " +getNewBalance.hbars.toTinybars() +" tinybar.")

*/

}
main();
