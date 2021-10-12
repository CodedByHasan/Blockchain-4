var express = require('express');
var router = express.Router();
const axios = require('axios'); //can be removed

/* GET home page. */
router.get('/', function (req, res) 
{
    res.render('index', { title: 'Express' });
});

module.exports = router;

const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, FileContentsQuery, FileId, TopicCreateTransaction, TopicMessageSubmitTransaction, getMessage, TopicMessageQuery, TopicId, getAdminKey, getSubmitKey, transaction} = require("@hashgraph/sdk");
require("dotenv").config();

const prompt = require('prompt-sync')();

