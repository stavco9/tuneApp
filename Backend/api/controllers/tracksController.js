//'use strict';

var spotifyAuthentication = require('../../spotify-authentication');
const mongoConnection = require('../../mongo-connection');
var asyncPolling = require('async-polling');
const request = require('request'); // "Request" library
const searchKeys = [ 'a', 'e', 'i', 'o', 'u', 'er', 'ar', 'or', 'de', 'do' ];

const spotifyBaseUrl = "https://api.spotify.com/v1/";

var polling = asyncPolling(function(req, res){

	var result = {};

	var spotify_access_token_promise = spotifyAuthentication.getAccessTokenForPolling();

	keyLetter = searchKeys[Math.floor(Math.random()*searchKeys.length)];
	
	spotify_access_token_promise.then(function(spotify_access_token){

		var getParameters = {
			url: (spotifyBaseUrl + "search?q=*" + keyLetter + "*&type=track&limit=50"),
			headers: {
				'Authorization': 'Bearer ' + spotify_access_token
			},
			json: true
		};

		request.get(getParameters, async function(error, response, body) {
			if (!error && response.statusCode === 200) {
	
				//res.statusCode = 200;
	
				body.tracks.items.forEach(async item => {
	
					var trackResult = await mongoConnection.queryFromMongoDB('Tracks', {'id': item.id});
	
					if (trackResult.length < 1){
						await mongoConnection.addToMongoDB("Tracks", item);
					}
				});

				var tracks = body.tracks.items;
	
				tracks.forEach(async track => {
	
					var albumResult = await mongoConnection.queryFromMongoDB('Albums', {'id': track.album.id});
			
					if (albumResult.length < 1){
						await mongoConnection.addToMongoDB("Albums", track.album);
					}
			
					track.artists.forEach(async artist =>{
						var artistResult = await mongoConnection.queryFromMongoDB('Artists', {'id': artist.id});
			
						if (artistResult.length < 1){
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
	}, function(err){
		console.log(err);
	})

}, 25000);

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

module.exports = {
	tracksPolling: polling.run(),
	//tracksResult: polling.on('result')
};

// Get all tracks from DB
async function getAllTracks(req, res) {
}

// Saves a new artist, exposed at POST /artists
function AddNewTrack(req, res) {
// Add a new artist by req.body
}

// Gets a single artist by ID, exposed at GET /artists/artistID
function GetTrackById(req, res) {
// Return the artist in JSON format, get ID by req.params.artistId
}

// Updates a single artist by ID, exposed at PUT /artists/artistID
function UpdateTrackById(req, res) {
// Updates the artist by ID, get ID by req.params.artistId
}

// Deletes a single artist by ID, exposed at DELETE /artists/artistID
function DeleteTrackById(req, res) {
	// Deletes the artist by ID, get ID by req.params.artistId
}

//module.exports = {
	//getAllArtists: getAllArtists,
	//AddNewArtist: AddNewArtist,
	//GetArtistById: GetArtistById,
	//UpdateArtistById: UpdateArtistById,
	//DeleteArtistById: DeleteArtistById
//};