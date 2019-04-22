//'use strict';

var spotifyAuthentication = require('../../spotify-authentication');
const mongoConnection = require('../../mongo-connection');
const request = require('request'); // "Request" library

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

// Saves a new artist, exposed at POST /artists
function LikeArtistById(req, res) {
	var artistResult = mongoConnection.queryFromMongoDB('Artists', {'id': req.params.artistId});
	artistResult.then(async function (result) {
		if (result.length < 1) {
			res.status(404).send('The artist with the ID ' + req.params.artistId + " was not found!");
		}
		else {
			if (req.session.token == null){
				res.status(401).send('You are unauthorized! Please login!');
			}
			else{
				var email = req.session.token.email;

				// REPLACE THE EMAIL WITH req.session.token.email IT SHOULD WORK IF YOU'RE USING A REAL WEB APP!
				var user = await mongoConnection.queryFromMongoDB('users', {'email': 'talfin84@gmail.com'});
				//var user = await mongoConnection.queryFromMongoDB('users', {'email': email});

				if (user.length < 1) {
					res.status(401).send('You are unauthorized! Please login!');
				}
				var likedArtists = user[0].likedArtists;

				if (likedArtists === undefined) {
					likedArtists = [];
				}

				var length = likedArtists.length;
				likedArtists.push(req.params.artistId);
				likedArtists = arrayUnique(likedArtists);

				if (length !== likedArtists.length) {
					if (result[0].likes === undefined) { result[0].likes = 0; }
					result[0].likes++;
					await mongoConnection.updateMongoDB('Artists', {'id': req.params.artistId}, {likes: result[0].likes});
				}

				// REPLACE THE EMAIL WITH req.session.token.email IT SHOULD WORK IF YOU'RE USING A REAL WEB APP!
				//await mongoConnection.updateMongoDB('users', {'email': email}, {likedartists: likedartists});
				await mongoConnection.updateMongoDB('users', {'email': "talfin84@gmail.com"}, {likedArtists: likedArtists});

				res.status(200).send('Liked artist ' + req.params.artistId);
			}
		}
	});
}

// Saves a new artist, exposed at POST /artists
function UnlikeArtistById(req, res) {
	var artistResult = mongoConnection.queryFromMongoDB('Artists', {'id': req.params.artistId});
	artistResult.then(async function (result) {
		if (result.length < 1) {
			res.status(404).send('The artist with the ID ' + req.params.artistId + " was not found!");
		}
		else {
			if (req.session.token == null){
				res.status(401).send('You are unauthorized! Please login!');
			}
			else{
				var email = req.session.token.email;

				// REPLACE THE EMAIL WITH req.session.token.email IT SHOULD WORK IF YOU'RE USING A REAL WEB APP!
				var user = await mongoConnection.queryFromMongoDB('users', {'email': 'talfin84@gmail.com'});
				//var user = await mongoConnection.queryFromMongoDB('users', {'email': email});

				if (user.length < 1) {
					res.status(401).send('You are unauthorized! Please login!');
				}
				var likedArtists = user[0].likedArtists;

				if (likedArtists === undefined) {
					likedArtists = [];
				}

				// Remove the unliked artist
				var index = likedArtists.indexOf(req.params.artistId);
				if (index > -1) {
					likedArtists.splice(index, 1);
					if (result[0].likes === undefined) { result[0].likes = 1; }
					result[0].likes--;
					await mongoConnection.updateMongoDB('Artists', {'id': req.params.artistId}, {likes: result[0].likes});
				}
				// REPLACE THE EMAIL WITH req.session.token.email IT SHOULD WORK IF YOU'RE USING A REAL WEB APP!
				await mongoConnection.updateMongoDB('users', {'email': 'talfin84@gmail.com'}, {likedArtists: likedArtists});
				//await mongoConnection.updateMongoDB('users', {'email': email}, {likedartists: likedartists});

				res.status(200).send('Unliked artist ' + req.params.artistId);
			}
		}
	});
}

// artists/top/artistId
async function GetTopArtists(req, res) {
	let limit = 10;
	if (req.params.limit !== undefined) {
		limit = parseInt(req.params.limit);
	}
	var artistResult = mongoConnection.queryFromMongoDBSortedMax('Artists', {likes: -1}, limit);
	artistResult.then(function (result) {
		res.json(result);
	});
}


module.exports = {
	getAllArtists: getAllArtists,
	AddNewArtist: AddNewArtist,
	GetArtistById: GetArtistById,
	UpdateArtistById: UpdateArtistById,
	DeleteArtistById: DeleteArtistById,
	LikeArtistById: LikeArtistById,
	UnlikeArtistById: UnlikeArtistById,
	GetTopArtists: GetTopArtists
};