//'use strict';

var spotifyAuthentication = require('../../spotify-authentication');
const mongoConnection = require('../../mongo-connection');
var asyncPolling = require('async-polling');
const request = require('request'); // "Request" library
const reqPromise = require('request-promise');
const usersController = require('usersController');
const searchKeys = [ 'a', 'e', 'i', 'o', 'u', 'er', 'ar', 'or', 'de', 'do' ];

const spotifyBaseUrl = "https://api.spotify.com/v1/";

var polling = asyncPolling(function(req, res){

	var result = {};

	// get Spotify access token for authentication
	var spotify_access_token_promise = spotifyAuthentication.getAccessTokenForPolling();

	// random key search letter from a constant array
	keyLetter = searchKeys[Math.floor(Math.random()*searchKeys.length)];
	
	// When the access token is given
	spotify_access_token_promise.then(function(spotify_access_token){

		// parameters of HTTP get request to query random tracks from Spotify
		var getSearchTrackParameters = {
			url: (spotifyBaseUrl + "search?q=*" + keyLetter + "*&type=track&limit=50"),
			headers: {
				'Authorization': 'Bearer ' + spotify_access_token
			},
			json: true
		};

		// Invoke the web request
		request.get(getSearchTrackParameters, async function(error, response, body) {

			// if the result is OK
			if (!error && response.statusCode === 200) {

				//console.log(body)

				// foreach track in the tracks array
				body.tracks.items.forEach(async item => {
	
					var trackResult = await mongoConnection.queryFromMongoDB('Tracks', {'id': item.id});
	
					if (trackResult.length < 1){
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
					.then(async function(featuresBody){
							//res.statusCode = 200;
							console.log(featuresBody)

							var featuresResult = await mongoConnection.queryFromMongoDB('AudioFeatures', {'id': featuresBody.id});

							if (featuresResult.length < 1){
								await mongoConnection.addToMongoDB("AudioFeatures", featuresBody);
							}
					})
					.catch(function(err){
						console.log(err);
					});

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
			}
			else {
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

// Get all tracks from DB
async function getAllTracks(req, res) {
	var Alltracks = await mongoConnection.queryFromMongoDB('Tracks', {});

	res.json(Alltracks);
}

async function getAllAudioFeatures(req, res){
	var AllAudioFeatures = await mongoConnection.queryFromMongoDB('AudioFeatures', {});

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

// MACHINE LEARNING !!!
function GetSimilarTracksById(req, res) {
	let trackId = req.params.trackId;
	let userId = usersController.GetUserIdFromReq(req);

	/*
	let preferredTracks = usersController.GetPreferredTracksByUserId(userId);
	let unfamilliarTracks = usersController.GetUnfamilliarTracksByUserId(userId);

	let allTrackIds = [...new Set([...preferredTracks, ...unfamilliarTracks].map(t => t.trackId))];
	*/

    let allTracksFeatures = allTrackIds.map((t) => {

    });

	let allTrackFeatures =

    PythonShell.run('script.py', { mode: 'json ', args: [[...preferredTracks, ...unfamilliarTracks], trackFeatures]}, function (err, results) {
        JSON.parse(results).map((i) => {
            return allTrackIds[i];
		});
    });


}
module.exports = {
	tracksPolling: polling.run(),
	getAllTracks: getAllTracks,
	AddNewTrack: AddNewTrack,
	GetTrackById: GetTrackById,
	UpdateTrackById: UpdateTrackById,
	DeleteTrackById: DeleteTrackById,
	getAllAudioFeatures: getAllAudioFeatures,
	AddNewAudioFeature: AddNewAudioFeature
};