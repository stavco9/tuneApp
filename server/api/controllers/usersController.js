const mongoConnection = require('../../mongo-connection');

function GetUserIdFromReq(req) {
    return req && req.session && req.session.token && req.session.token.email;
}

// Get the last listening of the user, sorted from the newest to oldest
async function GetLastActivitiesByUserId(userId, numOfActivities=300) {
    return (await mongoConnection.queryFromMongoDBSortedMax('ListeningAndSuggestions', {'email': userId}, {'_id': -1}, numOfActivities));
}

async function GetPreferredTracksByUserId(userId, numOfActivities=300) {
    let preferredTracks = {};
    let lastActivities = (await GetLastActivitiesByUserId(userId, numOfActivities)).reverse();
    let likes = [];
    let unlikes = [];
    let userInfo = await GetUserInfo(userId);

    if (userInfo.hasOwnProperty('likedTracks')){
        likes = userInfo.likedTracks;
    }
    if (userInfo.hasOwnProperty('unlikedTracks')){
        unlikes = userInfo.unlikedTracks;
    }

    let scale = 0;
    lastActivities.forEach((act) => {
        scale += 0.01;
        if(preferredTracks[act.trackId] === undefined) {
            preferredTracks[act.trackId] = 0;
        }
        preferredTracks[act.trackId] += act.score * scale;
    });

    likes.forEach((t) => {
        if(preferredTracks[t] === undefined) {
            preferredTracks[t] = 0;
        }
        preferredTracks[t] += 2;
    });

    unlikes.forEach((t) => {
        if(preferredTracks[t] === undefined) {
            preferredTracks[t] = 0;
        }
        preferredTracks[t] -= 2;
    });
    
    return (Object.keys(preferredTracks)
        .filter(t => preferredTracks[t] > 0)
        .sort(function(a, b) {
            return preferredTracks[b] - preferredTracks[a];
        }));
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