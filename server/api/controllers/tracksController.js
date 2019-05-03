//'use strict';
const {PyMachine} = require('../../MachineLearning/PyMachine/pymachine');
var spotifyAuthentication = require('../../spotify-authentication');
const mongoConnection = require('../../mongo-connection');
var asyncPolling = require('async-polling');
const request = require('request'); // "Request" library
const reqPromise = require('request-promise');
const usersController = require('usersController');
const searchKeys = [ 'a', 'e', 'i', 'o', 'u', 'er', 'ar', 'or', 'de', 'do' ];

const spotifyBaseUrl = "https://api.spotify.com/v1/";

let similarTracksMachine = new PyMachine(__dirname + '/../../MachineLearning/pythonScripts/similarTracks_KNN.py');

var polling = asyncPolling(function(req, res){

	var result = {};

	// get Spotify access token for authentication
	var spotify_access_token_promise = spotifyAuthentication.getAccessTokenForPolling();

	// random key search letter from a constant array
	//keyLetter = searchKeys[Math.floor(Math.random()*searchKeys.length)];
	keyLetter = 'a';

	// When the access token is given
	spotify_access_token_promise.then(async function(spotify_access_token){

		// parameters of HTTP get request to query random tracks from Spotify
		var getSearchTrackParameters = {
			url: (spotifyBaseUrl + "search?q=*" + keyLetter + "*&type=track&limit=50"),
			headers: {
				'Authorization': 'Bearer ' + spotify_access_token
			},
			json: true
		};
		var test = 42;

		while (test !== undefined || test !== null) {

			await sleep(10000);
			// Invoke the web request
			request.get(getSearchTrackParameters, async function (error, response, body) {

				// if the result is OK
				if (!error && response.statusCode === 200) {

					//console.log(body)
					getSearchTrackParameters.url = body.tracks.next;
					test = body.tracks.next;

					// foreach track in the tracks array
					body.tracks.items.forEach(async item => {

						var trackResult = await mongoConnection.queryFromMongoDB('Tracks', {'id': item.id});

						if (trackResult.length < 1) {
							await mongoConnection.addToMongoDB("Tracks", item);
						}
					});

					var tracks = body.tracks.items;

					tracks.forEach(async track => {

						var getAudioParameters = {
							url: (spotifyBaseUrl + "audio-features/" + track.id),
							headers: {
								'Authorization': 'Bearer ' + spotify_access_token
							},
							json: true
						};

						reqPromise(getAudioParameters)
							.then(async function (featuresBody) {
								//res.statusCode = 200;
								console.log(featuresBody)

								var featuresResult = await mongoConnection.queryFromMongoDB('AudioFeatures', {'id': featuresBody.id});

								if (featuresResult.length < 1) {
									await mongoConnection.addToMongoDB("AudioFeatures", featuresBody);
								}
							})
							.catch(function (err) {
								console.log(err);
							});

						var albumResult = await mongoConnection.queryFromMongoDB('Albums', {'id': track.album.id});

						if (albumResult.length < 1) {
							await mongoConnection.addToMongoDB("Albums", track.album);
						}

						track.artists.forEach(async artist => {
							var artistResult = await mongoConnection.queryFromMongoDB('Artists', {'id': artist.id});

							if (artistResult.length < 1) {
								await mongoConnection.addToMongoDB("Artists", artist);
							}
						})
					});

					end(null, result);

					res.json({"Added all items": "true"});
				} else {
					end(error);
					console.log("invalid_token");

					return;
				}
			});
		}
	}, function(err){
		console.log(err);
	})

}, 25000);

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

polling.on('result', function (tracks) {
    tracks.forEach(async track => {

		var albumResult = await mongoConnection.queryFromMongoDB('Albums', {'id': track.album.id});

		if (albumResult.length < 1){
			await mongoConnection.addToMongoDB("Albums", track.album);
		}

		tracks.artists.forEach(async artist =>{
			var artistResult = await mongoConnection.queryFromMongoDB('Artists', {'id': artist.id});

			if (artistResult.length < 1){
				await mongoConnection.addToMongoDB("Artists", artist);
			}
		})
	});
});

// Get all tracks from DB
async function getAllTracks(req, res) {
	var Alltracks = await mongoConnection.queryFromMongoDB('Tracks', {}, 1000);

	res.json(Alltracks);
}

async function getAllAudioFeatures(req, res){
	var AllAudioFeatures = await mongoConnection.queryFromMongoDB('AudioFeatures', {}, 1000);

	res.json(AllAudioFeatures);
}

// Saves a new artist, exposed at POST /artists
function AddNewAudioFeature(req, res) {
	// Add a new artist by req.body
}

// Saves a new artist, exposed at POST /artists
function AddNewTrack(req, res) {
// Add a new artist by req.body
}

// Gets a single artist by ID, exposed at GET /artists/artistID
function GetTrackById(req, res) {
	if (req.params.trackId === 'top') {
		GetTopTracks(req, res);
	}
	else {
		var trackResult = mongoConnection.queryFromMongoDB('Tracks', {'id': req.params.trackId});
		trackResult.then(function (result) {
			if (result.length < 1) {
				res.status(404).send('The track with the ID ' + req.params.trackId + " was not found!");
			} else {
				res.json(result);
			}
		});
	}

}

// Updates a single artist by ID, exposed at PUT /artists/artistID
function UpdateTrackById(req, res) {
// Updates the artist by ID, get ID by req.params.artistId
}

// Deletes a single artist by ID, exposed at DELETE /artists/artistID
function DeleteTrackById(req, res) {
	// Deletes the artist by ID, get ID by req.params.artistId
}

var arrayUnique = function (arr) {
	return arr.filter(function(item, index){
		return arr.indexOf(item) >= index;
	});
};

// Saves a new artist, exposed at POST /artists
function LikeTrackById(req, res) {
	var trackResult = mongoConnection.queryFromMongoDB('Tracks', {'id': req.body.trackId});
	trackResult.then(async function (result) {
		if (result.length < 1) {
			res.status(404).send('The track with the ID ' + req.body.trackId + " was not found!");
		}
		else {
			//if (req.session.token == null){
			//	res.status(401).send('You are unauthorized! Please login!');
			//}
			//else{
				//var email = req.session.token.email;

				// REPLACE THE EMAIL WITH req.session.token.email IT SHOULD WORK IF YOU'RE USING A REAL WEB APP!
				var user = await mongoConnection.queryFromMongoDB('users', {'email': 'talfin84@gmail.com'});
				//var user = await mongoConnection.queryFromMongoDB('users', {'email': email});

				if (user.length < 1) {
					res.status(401).send('You are unauthorized! Please login!');
				}

				var likedTracks = user[0].likedTracks;
				if (likedTracks === undefined) {
					likedTracks = [];
				}

				var unlikedTracks = user[0].unlikedTracks;
				if (unlikedTracks === undefined) {
					unlikedTracks = [];
				}

				var length = likedTracks.length;
				likedTracks.push(req.body.trackId);
				likedTracks = arrayUnique(likedTracks);
				
				// Add the track to the liked tracks
				if (length !== likedTracks.length) {
					if (result[0].likes === undefined) { result[0].likes = 0; }

					result[0].likes++;
					await mongoConnection.updateMongoDB('Tracks', {'id': req.body.trackId}, {likes: result[0].likes});

					await mongoConnection.updateMongoDB('AudioFeatures', {'id': req.body.trackId}, {likes: result[0].likes});
				}

				// Remove the liked track from the unlike tracksp if exists
				var index = unlikedTracks.indexOf(req.body.trackId);
				if (index > -1) {
					unlikedTracks.splice(index, 1);
					if (result[0].unlikes === undefined) { result[0].unlikes = 1; }
					result[0].unlikes--;
					await mongoConnection.updateMongoDB('Tracks', {'id': req.body.trackId}, {unlikes: result[0].unlikes});

					await mongoConnection.updateMongoDB('AudioFeatures', {'id': req.body.trackId}, {unlikes: result[0].unlikes});
				}

				// REPLACE THE EMAIL WITH req.session.token.email IT SHOULD WORK IF YOU'RE USING A REAL WEB APP!
				//await mongoConnection.updateMongoDB('users', {'email': email}, {likedTracks: likedTracks});
				await mongoConnection.updateMongoDB('users', {'email': "talfin84@gmail.com"}, {likedTracks: likedTracks, unlikedTracks: unlikedTracks});

				res.status(200).send('Liked track ' + req.body.trackId);
			//}
		}
	});
}

// Saves a new artist, exposed at POST /artists
function UnlikeTrackById(req, res) {
	var trackResult = mongoConnection.queryFromMongoDB('Tracks', {'id': req.body.trackId});
	trackResult.then(async function (result) {
		if (result.length < 1) {
			res.status(404).send('The track with the ID ' + req.body.trackId + " was not found!");
		}
		else {
			//if (req.session.token == null){
			//	res.status(401).send('You are unauthorized! Please login!');
			//}
			//else{
				//var email = req.session.token.email;

				// REPLACE THE EMAIL WITH req.session.token.email IT SHOULD WORK IF YOU'RE USING A REAL WEB APP!
				var user = await mongoConnection.queryFromMongoDB('users', {'email': 'talfin84@gmail.com'});
				//var user = await mongoConnection.queryFromMongoDB('users', {'email': email});

				if (user.length < 1) {
					res.status(401).send('You are unauthorized! Please login!');
				}

				var unlikedTracks = user[0].unlikedTracks;
				if (unlikedTracks === undefined) {
					unlikedTracks = [];
				}

				var likedTracks = user[0].likedTracks;
				if (likedTracks === undefined) {
					likedTracks = [];
				}

				var length = unlikedTracks.length;
				unlikedTracks.push(req.body.trackId);
				unlikedTracks = arrayUnique(unlikedTracks);

				// Add the track to the unliked tracks
				if (length !== unlikedTracks.length) {
					if (result[0].unlikes === undefined) { result[0].unlikes = 0; }

					result[0].unlikes++;
					await mongoConnection.updateMongoDB('Tracks', {'id': req.body.trackId}, {unlikes: result[0].unlikes});

					await mongoConnection.updateMongoDB('AudioFeatures', {'id': req.body.trackId}, {unlikes: result[0].unlikes});
				}

				// Remove the unliked track from the likes list if exists
				var index = likedTracks.indexOf(req.body.trackId);
				if (index > -1) {
					likedTracks.splice(index, 1);
					if (result[0].likes === undefined) { result[0].likes = 1; }
					result[0].likes--;
					await mongoConnection.updateMongoDB('Tracks', {'id': req.body.trackId}, {likes: result[0].likes});

					await mongoConnection.updateMongoDB('AudioFeatures', {'id': req.body.trackId}, {likes: result[0].likes});
				}
				
				// REPLACE THE EMAIL WITH req.session.token.email IT SHOULD WORK IF YOU'RE USING A REAL WEB APP!
				await mongoConnection.updateMongoDB('users', {'email': 'talfin84@gmail.com'}, {likedTracks: likedTracks, unlikedTracks: unlikedTracks});
				//await mongoConnection.updateMongoDB('users', {'email': email}, {likedTracks: likedTracks});

				res.status(200).send('Unliked track ' + req.body.trackId);
			//}
		}
	});
}


function ConvertAudioFeaturesJsonToArray(json) {
    let features = [];
    features.push(json.danceability);
    features.push(json.energy);
    features.push(json.key);
    features.push(json.loudness);
    features.push(json.mode);
    features.push(json.speechiness);
    features.push(json.acousticness);
    features.push(json.instrumentalness);
    features.push(json.liveness);
    features.push(json.valence);
    features.push(json.tempo);
    features.push(json.time_signature);

    return features;
}

// MACHINE LEARNING !!!
// LIOR CURRENTLY WORKING ON IT @@@@@@@@@@@@@@@@@@@@@@@@
// DO NOT CHANGE IT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
async function GetSimilarTracksById(req, res) {
	let trackId = req.params.trackId;
	//let userId = usersController.GetUserIdFromReq(req);
	//let test = (await mongoConnection.queryFromMongoDBSortedMax('AudioFeatures', {}, {likes: -1}, 500));
    let trackFeatures = ConvertAudioFeaturesJsonToArray((await mongoConnection.queryFromMongoDB('AudioFeatures', {'id': trackId}))[0]);
    let allTracksFeatures = (await mongoConnection.queryFromMongoDBSortedMax('AudioFeatures', {}, {likes: -1}, 200)).map((j) => {
        return ConvertAudioFeaturesJsonToArray(j);
    });

	
	let preferredTracks = usersController.GetPreferredTracksByUserId(userId, 1000);
	let unfamilliarTracks = usersController.GetUnfamilliarTracksByUserId(userId);

	let allTrackIds = [...new Set([...preferredTracks, ...unfamilliarTracks].map(t => t.trackId))];
	

    /*let allTracksFeatures = allTrackIds.map((t) => {
        mongoConnection.queryFromMongoDB('AudioFeatures', {'id': t.trackId})
	});*/
	
	let similar = await similarTracksMachine.run({
		'y': trackFeatures,
		'X': allTracksFeatures
	});

	res.status(200).send(similar);
}

// tracks/top/trackId
async function GetTopTracks(req, res) {
	let limit = 10;
	if (req.params.limit !== undefined) {
		limit = parseInt(req.params.limit);
	}
	var trackResult = mongoConnection.queryFromMongoDBSortedMax('Tracks', {}, {likes: -1}, limit);
	trackResult.then(function (result) {
		res.json(result);
	});
}

module.exports = {
	//tracksPolling: polling.run(),
	getAllTracks: getAllTracks,
	AddNewTrack: AddNewTrack,
	GetTrackById: GetTrackById,
	UpdateTrackById: UpdateTrackById,
	DeleteTrackById: DeleteTrackById,
	getAllAudioFeatures: getAllAudioFeatures,
	AddNewAudioFeature: AddNewAudioFeature,
	LikeTrackById: LikeTrackById,
	UnlikeTrackById: UnlikeTrackById,
    GetSimilarTracksById: GetSimilarTracksById,
	GetTopTracks: GetTopTracks
};