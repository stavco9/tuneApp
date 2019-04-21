//'use strict';

var spotifyAuthentication = require('../../spotify-authentication');
const mongoConnection = require('../../mongo-connection');
const request = require('request'); // "Request" library

// Get all tracks from DB
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

module.exports = {
	getAllArtists: getAllArtists,
	AddNewArtist: AddNewArtist,
	GetArtistById: GetArtistById,
	UpdateArtistById: UpdateArtistById,
	DeleteArtistById: DeleteArtistById
};