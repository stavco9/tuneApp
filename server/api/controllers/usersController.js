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
//          id (of track)
//          name
//          AudioFeatures
//          ...
//          scoreForUser
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

    let scale = 1;
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


    let trackObjects = await mongoConnection.queryFromMongoDBJoin('Tracks', 'AudioFeatures', 'id', 'id',
        {'id': {
            $in: Object.keys(preferredTracks)
        }
    });

    Object.keys(preferredTracks).forEach((k) => {
        trackObjects.find((o) => o.id == k).scoreForUser = preferredTracks[k];
    });
    trackObjects.sort(function(a, b) {
        return b.scoreForUser - a.scoreForUser;
    });

    return trackObjects;
}

// =====   out:   =====
// [
//     {
//         id (of track)
//         name
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
async function GetPreferredTracksByUserId(userId, numOfActivities=300) {
    return ((await GetFamilliarTracksByUserId(userId, numOfActivities))
        .filter(t => t.scoreForUser > 0));
}

// =====   out:   =====
// [
//     {
//         id (of track)
//         name
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
async function GetUnfamilliarPopularTracksByUserId(userId, numOfActivities=1000) {
    let familliar = await GetFamilliarTracksByUserId(userId, numOfActivities);
    let popular = await mongoConnection.queryFromMongoDBJoinSort('Tracks', 'AudioFeatures', 'id', 'id', {}, familliar.length + 200, {'popularity': -1});

    return popular.filter((p) => !familliar.some((f) => p.id == f.id));
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

async function GetPreferencesNN(userId) {
    return ((await GetUserInfo(userId)).neuralnetwork);
}

function DoesUserExist(req, response) {
    const user =  req.body.user;
    mongoConnection.checkIfUserExists(user).then(answer => {
        if (answer) {
            req.session.token.email = user.email;
        }
        response.send(answer)
    });
}

function RegisterUser(req, res) {
    const user =  req.body.user;
    mongoConnection.addNewUser(user).then(newUser => {
       res(user);
    });
}

module.exports = {
    getMyDetails: getMyDetails,
    GetFamilliarTracksByUserId: GetFamilliarTracksByUserId,
    GetUnfamilliarPopularTracksByUserId: GetUnfamilliarPopularTracksByUserId,
    GetPreferredTracksByUserId: GetPreferredTracksByUserId,
    GetUserIdFromReq: GetUserIdFromReq,
    GetPreferencesNN: GetPreferencesNN,
    DoesUserExist: DoesUserExist,
    RegisterUser: RegisterUser
};