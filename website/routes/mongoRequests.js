var express = require('express');
var request = require('request');
var router = require('express').Router();
var mongodb = require('mongoose');

var mongoAddress = 'mongodb://localhost:27017/csproject';

/* Model Imports */
let bkModel = require('./schemas/businessKey');


/* REQUESTS */

//Check to see if Business Key is valid
router.get('/checkBusinessKey', function(req, res) {

    mongodb.connect(mongoAddress, function(err, db){

        db.collection('businesses').find({businessKey:req.query.businessKey}).toArray((err, result) => {
            if(err){
                res.send(err);
            }
            else{
                if(!result.length){
                    //If empty, return a 0
                    res.send("0");
                }
                else{
                    //If already in use, return a 1 (We want this)
                    res.send("1");
                }
            }

        });

        db.close();
    });

});

//Check to see if email address is already in use
router.get('/checkEmail', function(req, res) {

    mongodb.connect(mongoAddress, function(err, db){

        var email = req.query.email;
        db.collection('users').find({email:email}).toArray((err, result) => {
            if(err){
                res.send(err);
            }
            else{
                if(!result.length){
                    //If empty, return a 1
                    res.send("1");
                }
                else{
                    //If already in use, return a 0
                    res.send("0");
                }
            }

        });

        db.close();
    });

});

//Insert a new user into the DB
router.get('/insertUser', function(req, res) {

    mongodb.connect(mongoAddress, function(err, db){

        db.collection('users').insertOne({
            email: req.query.email,
            password: req.query.password,
            address: req.query.address,
            postcode: req.query.postcode,
            businessKey: req.query.businessKey
        }, function(error, response){

            if(error){
                res.send(error);
            }
            else{
                res.send(response);
            }

        });

        db.close();
    });

});


module.exports = router;