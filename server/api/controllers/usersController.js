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
            user = (await mongoConnection.queryFromMongoDBProjection('users', {'email': userId}, 1, {neuralnetwork: 0}));
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
    return (GetPreferredTracksUsingFamilliarTracks(
        await GetFamilliarTracksByUserId(user, numOfActivities)
    ));
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
function GetPreferredTracksUsingFamilliarTracks(familliarTracks) {
    return (familliarTracks.filter(t => t.scoreForUser > 0));
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
    let likedByArtists = await GetTracksByLikedArtists(user, familliar.length + 100);
    //let likedByArtists = [];
    
    let popular = [];

    if (likedByArtists.length < familliar.length + 100){
        popular = await mongoConnection.queryFromMongoDBJoinSort('Tracks', 'AudioFeatures', 'id', 'id', {}, familliar.length + 100 - likedByArtists.length , {'popularity': -1});
    }    

    popular = popular.concat(likedByArtists);

    return popular.filter((p) => !familliar.some((f) => p.id == f.id));
}

async function GetTracksByLikedArtists(user, numOfTracks=1000){

    let allTracks = [];

    if (user.hasOwnProperty('likedArtists')){
        
        for(let i = 0; i < user.likedArtists.length; i++) {

            let tracksOfCurrArtist = await mongoConnection.queryFromMongoDBJoin("Tracks", "AudioFeatures", "id", "id", {
                'artists': { 
                    $elemMatch: { 
                        'id': user.likedArtists[i]
                    } 
                }
            }, numOfTracks)
    
            allTracks = allTracks.concat(tracksOfCurrArtist);
        };

        allTracks = allTracks.sort((a, b) => b.popularity - a.popularity);
    }

    return allTracks;
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

async function getMyDetails(req, res){
    userDevMode(req);

    user = GetUserInfo(req, false);

    user.then(user =>{ 
        if (user == null){
            res.status(401).send("You are unauthorized !! Please login");
        }
        else{
            res.status(200).send(user);
        }
    })
}

async function CheckIfUserExsits(user){

    var answer = await mongoConnection.queryFromMongoDBProjection("users", {'email': user.email}, 1, {'neuralnetwork': 0});

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
    GetPreferredTracksUsingFamilliarTracks: GetPreferredTracksUsingFamilliarTracks,
    GetUserIdFromReq: GetUserIdFromReq,
    GetTracksByLikedArtists: GetTracksByLikedArtists,
    GetPreferencesNN: GetPreferencesNN,
    GetUserInfo: GetUserInfo,
    userDevMode: userDevMode,
    DoesUserExist: DoesUserExist,
    RegisterUser: RegisterUser,
    getMyDetails: getMyDetails
};