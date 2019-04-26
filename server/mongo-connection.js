var MongoClient = require('mongodb').MongoClient;

require('dotenv').config({path: __dirname+'/tuneApp.env'});

var url = process.env.CONNECTION_URL + process.env.COLLECTION_NAME; //"mongodb://tune-dev-mdb.westeurope.cloudapp.azure.com:27017/tuneApp";
const express = require('express');
const session = require('express-session');
const app = require('./index');

async function queryFromMongoDB(collectionName, queryField, callback){
    
    try{
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.COLLECTION_NAME);
            
        const result = await dbo.collection(collectionName).find(queryField).toArray();
    
        db.close();
    
        return result;
    }
    catch(err){
        throw err;
    }
}

async function queryFromMongoDBSortedMax(collectionName, sortField, limit, callback){

    try{
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.COLLECTION_NAME);

        const result = await dbo.collection(collectionName).find().sort(sortField).limit(limit).toArray();

        db.close();

        return result;
    }
    catch(err){
        throw err;
    }
}

async function addToMongoDB(collectionName, jsonData){

    try{
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.COLLECTION_NAME);

        await dbo.collection(collectionName).insert(jsonData);

        db.close();
    }
    catch(err){
        throw err;
    }
}

async function updateMongoDB(collectionName, queryField, updateData){

    try{
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.COLLECTION_NAME);
        
        await dbo.collection(collectionName).update(queryField, {$set: updateData});

        db.close();
    }
    catch(err){
        throw err;
    }
}

async function deleteFromMongoDB(collectionName, queryField){

    try{
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.COLLECTION_NAME);
        
        await dbo.collection(collectionName).remove(queryField);

        db.close();
    }
    catch(err){
        throw err;
    }
}

module.exports = {
    queryFromMongoDB: queryFromMongoDB,
    addToMongoDB: addToMongoDB,
    updateMongoDB: updateMongoDB,
    deleteFromMongoDB: deleteFromMongoDB,
    queryFromMongoDBSortedMax: queryFromMongoDBSortedMax
};