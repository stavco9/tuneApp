//'use strict';

var spotifyAuthentication = require('../../spotify-authentication');
const mongoConnection = require('../../mongo-connection');
var asyncPolling = require('async-polling');
const request = require('request'); // "Request" library
const reqPromise = require('request-promise');
var {PythonShell} = require('python-shell');
//const usersController = require('usersController');
const searchKeys = [ 'a', 'e', 'i', 'o', 'u', 'er', 'ar', 'or', 'de', 'do' ];

// Get all Albums from DB
async function getAllAlbums(req, res) {
	var Allalbums = await mongoConnection.queryFromMongoDB('Albums', {});

	res.json(Allalbums);
}

// Saves a new artist, exposed at POST /artists
function AddNewAlbum(req, res) {
// Add a new artist by req.body
}

// Gets a single artist by ID, exposed at GET /artists/artistID
function GetAlbumById(req, res) {
	if (req.params.albumId === 'top') {
		GetTopAlbums(req, res);
	}
	else {
		var albumResult = mongoConnection.queryFromMongoDB('Albums', {'id': req.params.albumId});
		albumResult.then(function (result) {
			if (result.length < 1) {
				res.status(404).send('The album with the ID ' + req.params.albumId + " was not found!");
			} else {
				res.json(result);
			}
		});
	}

}

// Updates a single artist by ID, exposed at PUT /artists/artistID
function UpdateAlbumById(req, res) {
// Updates the artist by ID, get ID by req.params.artistId
}

// Deletes a single artist by ID, exposed at DELETE /artists/artistID
function DeleteAlbumById(req, res) {
	// Deletes the artist by ID, get ID by req.params.artistId
}

var arrayUnique = function (arr) {
	return arr.filter(function(item, index){
		return arr.indexOf(item) >= index;
	});
};

module.exports = {
	getAllAlbums: getAllAlbums,
	AddNewAlbum: AddNewAlbum,
	GetAlbumById: GetAlbumById,
	UpdateAlbumById: UpdateAlbumById,
	DeleteAlbumById: DeleteAlbumById,
};