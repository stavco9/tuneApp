var MongoClient = require('mongodb').MongoClient;

require('dotenv').config({path: __dirname + '/tuneApp.env'});

var url = ('mongodb://' + process.env.MONGO_USER_NAME + ':' + process.env.MONGO_PASSWORD + '@' + process.env.MONGO_HOSTNAME + '/' + process.env.MONGO_DATABASE); //"mongodb://tune-dev-mdb.westeurope.cloudapp.azure.com:27017/tuneApp";
const express = require('express');
const session = require('express-session');
const app = require('./index');
const mongoose = require('mongoose');

mongoose.connect(url, {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    name: String,
    givenName: String,
    familyName: String,
    email: String,
    id: String,
    photo: String,
    likedArtists: Array,
    likedTracks: Array,
    unlikedArtists: Array,
    unlikedTracks: Array
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

});

const UserModel = mongoose.model('user', userSchema);

async function checkIfUserExists(user) {
    const foundUser = await UserModel.findOne({'email': user.email}).exec();
    return foundUser === undefined;
}

const addNewUser = user => {
    const newUser = new UserModel(user);
    newUser.save().then((err, newUser) => {
        return newUser;
        }
    )
};

async function queryFromMongoDB(collectionName, queryField, limit, callback) {

    try {
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.MONGO_DATABASE);

        limit = limit != undefined ? limit : 1000;

        const result = await dbo.collection(collectionName).find(queryField).limit(limit).toArray();

        db.close();

        return result;
    } catch (err) {
        throw err;
    }
}

async function queryFromMongoDBSortedMax(collectionName, queryField, sortField, limit, callback) {

    try {
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.MONGO_DATABASE);

        limit = limit != undefined ? limit : 1000;

        const result = await dbo.collection(collectionName).find(queryField).sort(sortField).limit(limit).toArray();

        db.close();

        return result;
    } catch (err) {
        throw err;
    }
}

async function queryFromMongoDBJoin(firstCollectionName, secondCollectionName, firstCollectionField, secondCollectionField, matchField, limit, callback) {

    try {
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
            },
            {
                $unwind: ("$" + secondCollectionName)
            }]).toArray();

        db.close();

        return result;
    } catch (err) {
        throw err;
    }
}

async function queryFromMongoDBJoinSort(firstCollectionName, secondCollectionName, firstCollectionField, secondCollectionField, matchField, limit, sortField, callback) {

    try {
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.MONGO_DATABASE);

        limit = limit != undefined ? limit : 1000;

        const result = await dbo.collection(firstCollectionName).aggregate([
            {
                $match: matchField
            },
            {
                $limit: limit
            },
            {
                $sort: sortField
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
                $unwind: ("$" + secondCollectionName)
            }]).toArray();

        db.close();

        return result;
    } catch (err) {
        throw err;
    }
}

async function addToMongoDB(collectionName, jsonData) {

    try {
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.MONGO_DATABASE);

        await dbo.collection(collectionName).insert(jsonData);

        db.close();
    } catch (err) {
        throw err;
    }
}

async function updateMongoDB(collectionName, queryField, updateData) {

    try {
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.MONGO_DATABASE);

        await dbo.collection(collectionName).update(queryField, {$set: updateData});

        db.close();
    } catch (err) {
        throw err;
    }
}

async function deleteFromMongoDB(collectionName, queryField) {

    try {
        const db = await MongoClient.connect(url);

        var dbo = db.db(process.env.MONGO_DATABASE);

        await dbo.collection(collectionName).remove(queryField);

        db.close();
    } catch (err) {
        throw err;
    }
}

module.exports = {
    queryFromMongoDB: queryFromMongoDB,
    addToMongoDB: addToMongoDB,
    updateMongoDB: updateMongoDB,
    deleteFromMongoDB: deleteFromMongoDB,
    queryFromMongoDBSortedMax: queryFromMongoDBSortedMax,
    queryFromMongoDBJoin: queryFromMongoDBJoin,
    queryFromMongoDBJoinSort: queryFromMongoDBJoinSort,
    checkIfUserExists: checkIfUserExists,
    addNewUser: addNewUser
};