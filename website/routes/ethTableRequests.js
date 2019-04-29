var express = require('express');
var request = require('request');
var router = require('express').Router();
var Web3 = require('web3');


/* GET ethStats listing. */
router.get('/ethStats', function(req, res) {
    request("https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=GBP",
        function(error, response, body){
        var coinInfo = JSON.parse(body);

        //Parse large dataset to get Eth Price, Eth Market Cap, % change in past 24 hours,
        // Current block, Supply, Volume

        //Check if Eth Data exists
        var elementPos = coinInfo.Data.map(function(x) {return x.CoinInfo.Name;}).indexOf("ETH");

        if(elementPos != -1){
            var ethData = coinInfo.Data[elementPos];
            var ethDataObj = {"price":ethData.RAW.GBP.PRICE, "marketCap":ethData.RAW.GBP.MKTCAP,
                "mktCapChange24": ethData.RAW.GBP.CHANGEPCT24HOUR, "blockNum": ethData.CoinInfo.BlockNumber,
                "supply":ethData.RAW.GBP.SUPPLY, "volume":ethData.RAW.GBP.VOLUME24HOURTO};

            console.log(ethDataObj);
            
            res.send(ethDataObj);
        }
        else{
            res.send(error);
        }

    })
});



/* GET ethTransactions listing. */
router.get('/recentTransactions', function(req, res) {

    var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/91385a4c298148b58b285223dc9fc33b'));
    var transactions = [];
    var curBlock = (web3.eth.getBlock('latest'));
    var totalTransactions = curBlock.transactions;

    if(totalTransactions.length > 10){
        //Populate 10 transactions from latest block found
        for(var i=0; i<10; i++){
            transactions.push(totalTransactions[i]);
        }
    }
    else{
        //Populate 10 transactions from as many blocks in chronological order as necessary
        while(transactions.length < 10){
            var prevBlock = curBlock.number-1;

            for(var j in totalTransactions){
                transactions.push(totalTransactions[j]);
            }

            curBlock = web3.eth.getBlock(prevBlock);
            totalTransactions = curBlock.transactions;

        }
    }

    //console.log(transactions);
    res.send(transactions);


});

/* GET latest block number. */
router.get('/latestBlock', function(req, res) {

    var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/91385a4c298148b58b285223dc9fc33b'));

    try{
        var curBlock = web3.eth.getBlock('latest').number;
        res.send(curBlock.toString());
    }
    catch{
        res.send("Error: No Blocks Found");
    }

});


/* GET data for given block */
router.get('/blockData', function(req, res) {

    var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/91385a4c298148b58b285223dc9fc33b'));

    try{
        var curBlock = web3.eth.getBlock(req.query.blockNumber);

        if(curBlock){
            var blockData = {number: curBlock.number, hash: curBlock.hash, timestamp: curBlock.timestamp,
                miner: curBlock.miner, difficulty: curBlock.difficulty, size: curBlock.size,
                gasUsed: curBlock.gasUsed, transactions: curBlock.transactions};

            res.send(blockData);

        }
    }
    catch{
        res.send("Error: No Block Data Found");
    }

});


/* GET data for given transaction */
router.get('/transactionData', function(req, res) {

    var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/91385a4c298148b58b285223dc9fc33b'));

    try{

        var curBlock = web3.eth.getTransaction(req.query.transactionNumber);

        if(curBlock){
            var transactionData = {hash: curBlock.blockHash, block: curBlock.blockNumber,
                from: curBlock.from, to: curBlock.to, value: curBlock.value, gasUsed: curBlock.gas,
                gasPrice: curBlock.gasPrice};

            res.send(transactionData);

        }
    }
    catch{
        res.send("Error: No Transaction Data Found");
    }

});

module.exports = router;



//Eth Price
//https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YourApiKeyToken

//Blocks
//https://api.etherscan.io/api?module=block&action=getblockreward&blockno=2165403&apikey=YourApiKeyToken

//BIG DADDY
//https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=GBP

//SOcial Data for Eth
//https://min-api.cryptocompare.com/data/social/coin/latest?coinId=7605


//Etherscan
//API KEY = TJ21I2N31DUM5CB2GAY54ZRJRI3T9RHAAJ

//Cryptocompare
//6e5e516bb82de05baaa943a31b9948a38205eb4cd8b37cde34e859c95aa403d2