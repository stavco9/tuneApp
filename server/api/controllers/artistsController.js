//'use strict';

const mongoConnection = require('../../mongo-connection');

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
	if(user == null) {
		res.status(401).send('You are unauthorized! Please login!');
	}

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

			await mongoConnection.updateMongoDB('users', {'email': user.email}, {likedArtists: likedArtists, unlikedArtists: unlikedArtists});

			res.status(200).send('Liked artist ' + req.body.artistId);
		}
	});
}

// Saves a new artist, exposed at POST /artists
function UnlikeArtistById(req, res) {
	users.userDevMode(req);
	let user = users.GetUserInfo(req);
	if(user == null) {
		res.status(401).send('You are unauthorized! Please login!');
	}

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

			await mongoConnection.updateMongoDB('users', {'email': user.email}, {unlikedArtists: unlikedArtists});

			res.status(200).send('unliked artist ' + req.body.artistId);
		}
	});
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
	getAllArtists: getAllArtists,
	AddNewArtist: AddNewArtist,
	GetArtistById: GetArtistById,
	UpdateArtistById: UpdateArtistById,
	DeleteArtistById: DeleteArtistById,
	LikeArtistById: LikeArtistById,
	UnlikeArtistById: UnlikeArtistById,
	GetTopArtists: GetTopArtists
};