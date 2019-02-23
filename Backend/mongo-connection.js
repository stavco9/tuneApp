var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://tune-dev-mdb.westeurope.cloudapp.azure.com:27017/tuneApp";
const express = require('express');
const session = require('express-session');
const app = require('./server');

module.exports = {
    addToMongoDB: function(collectionName, jsonData){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            
            console.log("Connected to database");

            var dbo = db.db("tuneApp");
            
            dbo.collection(collectionName).insertOne(jsonData, function(err, res){
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            })


        });
    }
};