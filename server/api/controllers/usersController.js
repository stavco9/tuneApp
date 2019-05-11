const mongoConnection = require('../../mongo-connection');

function GetUserIdFromReq(req) {
    return req && req.session && req.session.token && req.session.token.email;
}

// Get the last listening of the user, sorted from the newest to oldest
// each returned object should look like that:
// {
//     trackId
//     score
// }
async function GetLastActivitiesByUserId(userId, numOfActivities=300) {
    return (await mongoConnection.queryFromMongoDBSortedMax('ListeningAndSuggestions', {'email': userId}, {'_id': -1}, numOfActivities));
}

async function GetUserInfo(userId){
    return (await mongoConnection.queryFromMongoDB('users', {'email': userId}))[0];
}

// returns
// [
//     {
//          trackId
//          name
//          AudioFeatures
//          ...
//          score
//      }
// ]
async function GetFamilliarTracksByUserId(userId, numOfActivities=300) {
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
        .sort(function(a, b) {
            return preferredTracks[b] - preferredTracks[a];
        })
        // LIOR: HERE, MAKE A QUERY AND RETURN FULL TRACK OBJECT.
        // THEN ADD A SCORE PROPERTY TO THE RETURNED TRACK OBJECT
        .map((t) => {
            return {
                trackId: t,
                score: preferredTracks[b]
            }
        }));
}

// =====   out:   =====
// [
//     {
//         trackId
//         name
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
async function GetPreferredTracksByUserId(userId, numOfActivities=300) {
    return (GetFamilliarTracksByUserId(userId, numOfActivities)
        .filter(t => t.score > 0));
}

// =====   out:   =====
// [
//     {
//         trackId
//         name
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
function GetUnfamilliarPopularTracksByUserId(userId, amout = 100) {
    // Get the most popular unfamilliar songs,
    // And the newest unfamilliar songs.
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
    GetFamilliarTracksByUserId: GetFamilliarTracksByUserId,
    GetUnfamilliarPopularTracksByUserId: GetUnfamilliarPopularTracksByUserId,
    GetPreferredTracksByUserId: GetPreferredTracksByUserId,
    GetUserIdFromReq: GetUserIdFromReq
};