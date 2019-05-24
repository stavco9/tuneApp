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

async function GetUserInfo(req, getNeuralNetwork = false){
    userDevMode(req);

    if(req.session.token && req.session.token.email) {
        const userId = req.session.token.email;
        let user = [];

        if(!getNeuralNetwork) {
            user = (await mongoConnection.queryFromMongoDBProjection('users', {'email': userId}, 1, {
                'neuralnetwork': false
            }));
        }
        else {
            user = (await mongoConnection.queryFromMongoDB('users', {'email': userId}));
        }

        if(user.length > 0) {
            return user[0];
        }
    }

    return null;
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
async function GetFamilliarTracksByUserId(user, numOfActivities=300) {
    let preferredTracks = {};
    let lastActivities = (await GetLastActivitiesByUserId(user.email, numOfActivities)).reverse();
    let likes = [];
    let unlikes = [];

    //let userInfo = await GetUserInfo(userId);

    if (user.hasOwnProperty('likedTracks')){
        likes = user.likedTracks;
    }
    if (user.hasOwnProperty('unlikedTracks')){
        unlikes = user.unlikedTracks;
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
async function GetPreferredTracksByUserId(user, numOfActivities=300) {
    return ((await GetFamilliarTracksByUserId(user, numOfActivities))
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
async function GetUnfamilliarPopularTracksByUserId(user, numOfActivities=1000) {
    let familliar = await GetFamilliarTracksByUserId(user, numOfActivities);
    let popular = await mongoConnection.queryFromMongoDBJoinSort('Tracks', 'AudioFeatures', 'id', 'id', {}, familliar.length + 100, {'popularity': -1});
    
    return popular.filter((p) => !familliar.some((f) => p.id == f.id));
}

async function GetPreferencesNN(user) {
    return (user.neuralnetwork);
}

function userDevMode(req) {
    if(process.env.ENVIRONMENT_MODE == 'dev') {
        req.session.token = {
            email: 'stavco9@gmail.com'
        }
    }
}

async function CheckIfUserExsits(user){
    var answer = await mongoConnection.queryFromMongoDB("users", {email: user.email}, 1);

    if (answer.length > 0){
        return true;
    }

    return false;
}

async function DoesUserExist(req, response) {
    const user =  req.body.user;

    var exists = await CheckIfUserExsits(user);

    if (exists){
        req.session.token = user;
    }

    response.status(200).send(exists);
}

async function RegisterUser(req, res) {
    
    var statusCode = 400;

    if (req.body.hasOwnProperty("user")){
        
        statusCode = 200;

        var userToAdd = {};

        const user =  req.body.user;

        user["likedTracks"] = [];
        user["unlikedTracks"] = [];
        user["likedArtists"] = [];
        user["unlikedArtists"] = [];

        if (!await CheckIfUserExsits(user)){
            await mongoConnection.addToMongoDB("users", user);
        }

        res.status(statusCode).send(user);
    }
    else{
        res.status(statusCode).send("Bad request");
    }
}

module.exports = {
    GetFamilliarTracksByUserId: GetFamilliarTracksByUserId,
    GetUnfamilliarPopularTracksByUserId: GetUnfamilliarPopularTracksByUserId,
    GetPreferredTracksByUserId: GetPreferredTracksByUserId,
    GetUserIdFromReq: GetUserIdFromReq,
    GetPreferencesNN: GetPreferencesNN,
    GetUserInfo: GetUserInfo,
    userDevMode: userDevMode,
    DoesUserExist: DoesUserExist,
    RegisterUser: RegisterUser
};