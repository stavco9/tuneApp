//'use strict';

const mongoConnection = require('../../mongo-connection');
const spotifyAuthentication = require('../../spotify-authentication');
const users = require('./usersController');
var asyncPolling = require('async-polling');
const request = require('request');

const spotifyBaseUrl = "https://api.spotify.com/v1/";

var polling = asyncPolling(function(req, res){

	var result = {};

	// get Spotify access token for authentication
	var spotify_access_token_promise = spotifyAuthentication.getAccessTokenForPolling();

	// When the access token is given
	spotify_access_token_promise.then(async function(spotify_access_token){

		var allArtistsIds = await mongoConnection.queryFromMongoDBProjection("Artists", {"images": {$exists: false}}, 20000, {"id": 1});

		for (i=0; i < allArtistsIds.length; i++){
			
			// parameters of HTTP get request to query random tracks from Spotify
			var getSearchTrackParameters = {
				url: (spotifyBaseUrl + "artists/" + allArtistsIds[i].id),
				headers: {
					'Authorization': 'Bearer ' + spotify_access_token
				},
				json: true
			};

			await sleep(1000);
			// Invoke the web request
			request.get(getSearchTrackParameters, async function (error, response, body) {
				// if the result is OK
				if (!error && response.statusCode === 200) {
					mongoConnection.updateMongoDB("Artists", {"id": body.id}, {"images": body.images});

					console.log("Updated artist " + body.id)
				}
				else {
					//end(error);
					console.log("not found");

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

// Get all artists from DB
async function getAllArtists(req, res) {
	var Allartists = await mongoConnection.queryFromMongoDB('Artists', {});

	res.json(Allartists);
}

// Saves a new artist, exposed at POST /artists
function AddNewArtist(req, res) {
// Add a new artist by req.body
}

// Gets a single artist by ID, exposed at GET /artists/artistID
function GetArtistById(req, res) {
	if (req.params.artistId === 'top') {
		GetTopArtists(req, res);
	}
	else {
		var artistResult = mongoConnection.queryFromMongoDB('Artists', {'id': req.params.artistId});
		artistResult.then(function (result) {
			if (result.length < 1) {
				res.status(404).send('The artist with the ID ' + req.params.artistId + " was not found!");
			} else {
				res.json(result);
			}
		});
	}
}

// Updates a single artist by ID, exposed at PUT /artists/artistID
function UpdateArtistById(req, res) {
// Updates the artist by ID, get ID by req.params.artistId
}

// Deletes a single artist by ID, exposed at DELETE /artists/artistID
function DeleteArtistById(req, res) {
	// Deletes the artist by ID, get ID by req.params.artistId
}

var arrayUnique = function (arr) {
	return arr.filter(function(item, index){
		return arr.indexOf(item) >= index;
	});
};

function LikeArtistById(req, res) {
	users.userDevMode(req);
	let user = users.GetUserInfo(req);

	user.then(user =>{
		if(user == null) {
			res.status(401).send('You are unauthorized! Please login!');
		}
		else{

			var artistResult = mongoConnection.queryFromMongoDB('Artists', {'id': req.body.artistId});
			artistResult.then(async function (result) {
				if (result.length < 1) {
					res.status(404).send('The artist with the ID ' + req.body.artistId + " was not found!");
				}
				else {
					var likedArtists = user.likedArtists;
					if (likedArtists === undefined) {
						likedArtists = [];
					}
	
					var unlikedArtists = user.unlikedArtists;
					if (unlikedArtists === undefined) {
						unlikedArtists = [];
					}
	
					var length = likedArtists.length;
					likedArtists.push(req.body.artistId);
					likedArtists = arrayUnique(likedArtists);
					
					// Add the artist to the liked artists
					if (length !== likedArtists.length) {
						if (result[0].likes === undefined) { result[0].likes = 0; }
	
						result[0].likes++;
						await mongoConnection.updateMongoDB('Artists', {'id': req.body.artistId}, {likes: result[0].likes});
					}
	
					// Remove the liked artist from the unlike artists if exists
					var index = unlikedArtists.indexOf(req.body.artistId);
					if (index > -1) {
						unlikedArtists.splice(index, 1);
						if (result[0].unlikes === undefined) { result[0].unlikes = 1; }
						result[0].unlikes--;
						await mongoConnection.updateMongoDB('Artists', {'id': req.body.artistId}, {unlikes: result[0].unlikes});
					}
	
					res.status(200).send('Liked artist ' + req.body.artistId);
	
					mongoConnection.updateMongoDB('users', {'email': user.email}, {likedArtists: likedArtists, unlikedArtists: unlikedArtists});
				}
			});
		}
	})
}

// Saves a new artist, exposed at POST /artists
function UnlikeArtistById(req, res) {
	users.userDevMode(req);

	let user = users.GetUserInfo(req);

	user.then(user => {
		if(user == null) {
			res.status(401).send('You are unauthorized! Please login!');
		}
		else{

			var artistResult = mongoConnection.queryFromMongoDB('Artists', {'id': req.body.artistId});
			artistResult.then(async function (result) {
				if (result.length < 1) {
					res.status(404).send('The artist with the ID ' + req.body.artistId + " was not found!");
				}
				else {
					var likedArtists = user.likedArtists;
					if (likedArtists === undefined) {
						likedArtists = [];
					}
	
					var unlikedArtists = user.unlikedArtists;
					if (unlikedArtists === undefined) {
						unlikedArtists = [];
					}
	
					var length = unlikedArtists.length;
					unlikedArtists.push(req.body.artistId);
					unlikedArtists = arrayUnique(unlikedArtists);
						
					// Add the artist to the unliked artists
					if (length !== unlikedArtists.length) {
						if (result[0].unlikes === undefined) { result[0].unlikes = 0; }
	
						result[0].unlikes++;
						await mongoConnection.updateMongoDB('Artists', {'id': req.body.artistId}, {unlikes: result[0].unlikes});
					}
	
					// Remove the unliked artist from the liked artists if exists
					var index = likedArtists.indexOf(req.body.artistId);
					if (index > -1) {
						likedArtists.splice(index, 1);
						if (result[0].likes === undefined) { result[0].likes = 1; }
						result[0].likes--;
						await mongoConnection.updateMongoDB('Artists', {'id': req.body.artistId}, {likes: result[0].likes});
					}
	
					res.status(200).send('unliked artist ' + req.body.artistId);
	
					mongoConnection.updateMongoDB('users', {'email': user.email}, {likedArtists: likedArtists, unlikedArtists: unlikedArtists});
				}
			});
		}
	})
}

async function GetArtistsByName(req, res){

	var artistResult = await mongoConnection.queryFromMongoDB("Artists", {"name": new RegExp(req.params.artistName, "i")});

	res.status(200).send(artistResult);
}

// artists/top/artistId
async function GetTopArtists(req, res) {
	let limit = 10;
	if (req.params.limit !== undefined) {
		limit = parseInt(req.params.limit);
	}
	var artistResult = mongoConnection.queryFromMongoDBSortedMax('Artists', {}, {likes: -1}, limit);
	artistResult.then(function (result) {
		res.json(result);
	});
}


module.exports = {
	//artistsPolling: polling.run(),
	getAllArtists: getAllArtists,
	AddNewArtist: AddNewArtist,
	GetArtistById: GetArtistById,
	UpdateArtistById: UpdateArtistById,
	DeleteArtistById: DeleteArtistById,
	LikeArtistById: LikeArtistById,
	UnlikeArtistById: UnlikeArtistById,
	GetArtistsByName, GetArtistsByName,
	GetTopArtists: GetTopArtists
};