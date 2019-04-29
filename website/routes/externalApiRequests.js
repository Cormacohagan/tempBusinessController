var express = require('express');
var request = require('request');
var router = require('express').Router();

//Check to see if Postcode is real
router.get('/checkPostcode', function(req, res) {
    request("https://api.postcodes.io/postcodes/"+req.query.postcode,//req.query.postcode,
        function(error, response, body){

            var info = JSON.parse(body);

            if(info.status != "200"){
                res.send("0");
            }
            else{
                res.send("1");
            }

        })
});



module.exports = router;