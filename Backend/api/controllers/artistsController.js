//'use strict';

var spotifyAuthentication = require('../../spotify-authentication');
const mongoConnection = require('../../mongo-connection');
const request = require('request'); // "Request" library
const searchKeys = [ 'a', 'e', 'i', 'o', 'u', 'er', 'ar', 'or', 'de', 'do' ];

const spotifyBaseUrl = "https://api.spotify.com/v1/";

async function getAllArtists(req, res) {
		
	// Get all artists here, add DB management or something
	// Dummy JSON
	var artists = [{
		'Id': 1,
		'Name': 'The Beatles'
	},
	{
		'Id': 2,
		'Name': 'Pink Floyd'
	}]

	var result = {};

	searchKeys.forEach(keyLetter => {
		var getParameters = {
			url: (spotifyBaseUrl + "search?q=*" + keyLetter + "*&type=artist&limit=50"),
			headers: {
				'Authorization': 'Bearer ' + (req.session.spotify_access_token)
			},
			json: true
		};
	
		request.get(getParameters, async function(error, response, body) {
			if (!error && response.statusCode === 200) {
	
				res.statusCode = 200;
	
				body.artists.items.forEach(async item => {
	
					var artistResult = await mongoConnection.queryFromMongoDB('Artists', {'id': item.id});
	
					if (artistResult.length < 1){
						await mongoConnection.addToMongoDB("Artists", item);
					}
				});
	
				result += body.artists.items;
				
				res.json({"Added all items": "true"});
	
			} else {
				console.log("invalid_token");
			}
		});
	});
}

// Saves a new artist, exposed at POST /artists
function AddNewArtist(req, res) {
// Add a new artist by req.body
}

// Gets a single artist by ID, exposed at GET /artists/artistID
function GetArtistById(req, res) {
// Return the artist in JSON format, get ID by req.params.artistId
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