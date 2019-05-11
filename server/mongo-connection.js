var MongoClient = require('mongodb').MongoClient;

require('dotenv').config({path: __dirname+'/tuneApp.env'});

var url = ('mongodb://'+ process.env.MONGO_USER_NAME +':'+ process.env.MONGO_PASSWORD + '@'+ process.env.MONGO_HOSTNAME + '/' + process.env.MONGO_DATABASE); //"mongodb://tune-dev-mdb.westeurope.cloudapp.azure.com:27017/tuneApp";
const express = require('express');
const session = require('express-session');
const app = require('./index');

async function queryFromMongoDB(collectionName, queryField, limit, callback){
    
    try{
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.MONGO_DATABASE);
        
        limit = limit != undefined ? limit : 1000;

        const result = await dbo.collection(collectionName).find(queryField).limit(limit).toArray();
    
        db.close();
    
        return result;
    }
    catch(err){
        throw err;
    }
}

async function queryFromMongoDBSortedMax(collectionName, queryField, sortField, limit, callback){

    try{
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.MONGO_DATABASE);

        limit = limit != undefined ? limit : 1000;

        const result = await dbo.collection(collectionName).find(queryField).sort(sortField).limit(limit).toArray();

        db.close();

        return result;
    }
    catch(err){
        throw err;
    }
}

async function queryFromMongoDBJoin(firstCollectionName, secondCollectionName, firstCollectionField, secondCollectionField, matchField, limit, callback){

    try{
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.MONGO_DATABASE);

        limit = limit != undefined ? limit : 1000;

        const result = await dbo.collection(firstCollectionName).aggregate([
        {   
            $match: matchField
        },
        {
            $lookup:
            {
                from: secondCollectionName,
                localField: secondCollectionField,
                foreignField: firstCollectionField,
                as: secondCollectionName
            }
        },
        {
            $limit: limit
        }]).toArray();

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

        var dbo = db.db(process.env.MONGO_DATABASE);

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

        var dbo = db.db(process.env.MONGO_DATABASE);
        
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

        var dbo = db.db(process.env.MONGO_DATABASE);
        
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
    queryFromMongoDBSortedMax: queryFromMongoDBSortedMax,
    queryFromMongoDBJoin: queryFromMongoDBJoin
};