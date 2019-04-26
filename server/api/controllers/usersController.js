const mongoConnection = require('../../mongo-connection');
const request = require('request'); // "Request" library

function GetUserIdFromReq(req) {
    return req && req.session && req.session.token && req.session.token.email;
}

function GetLastActivitiesByUserId(numOfActivities=200) {
    return []; // DO DATABASE SHIT
}

function GetPreferredTracksByUserId(userId) {
    let lastActivities = GetLastActivitiesByUserId();
    let scale = 0;
    let preferredTracks = lastActivities.map((act) => {
        scale += 0.01;
        return {
            trackId: act.trackId,
            score: act.score * scale
        }
    }).sort(function(a, b) {
        return b.score - a.score;
    });

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