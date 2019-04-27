const mongoConnection = require('../../mongo-connection');
const request = require('request'); // "Request" library

function GetUserIdFromReq(req) {
    return req && req.session && req.session.token && req.session.token.email;
}

// Get the last listening of the user, sorted from the newest to oldest
async function GetLastActivitiesByUserId(userId, numOfActivities=300) {
    return (await mongoConnection.queryFromMongoDBSortedMax('ListeningAndSuggestions', {'email': userId}, {'_id': -1}, numOfActivities));
}

async function GetPreferredTracksByUserId(userId, numOfActivities=200) {
    let lastActivities = await GetLastActivitiesByUserId(userId, numOfActivities);
    let scale = 3;

    let preferredTracks = [];

    for(var act in lastActivities){
        scale -= 0.01;

        let currTrack = {};

        currTrack['trackId'] = lastActivities[act].trackId;
        currTrack['score'] = lastActivities[act].score + scale;

        preferredTracks.push(currTrack);
    }

    /*
    let preferredTracks = lastActivities((act) => {
        scale += 0.01;
        return {
            trackId: act.trackId,
            score: act.score * scale
        }
    }).sort(function(a, b) {
        return b.score - a.score;
    });
    */

    return preferredTracks;
}

function GetUnfamilliarTracksByUserId(userId) {
    return []; // CHANGE THAT LATER
}

async function getMyDetails(req, res){
    
    if (!req.session.token){
        res.status(401).send("You are unauthorized !! Please login");
    }
    else{
        var userDetails = await mongoConnection.queryFromMongoDB("users", {"email": req.session.token.email});

        res.status(200).send(userDetails);
    }
}

module.exports = {
    getMyDetails: getMyDetails,
    GetUnfamilliarTracksByUserId: GetUnfamilliarTracksByUserId,
    GetPreferredTracksByUserId: GetPreferredTracksByUserId,
    GetUserIdFromReq: GetUserIdFromReq
};