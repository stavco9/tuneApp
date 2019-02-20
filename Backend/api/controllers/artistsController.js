'use strict';

// Returns a JSON of all artists, exposed at GET /artists
exports.getAllArtists = function(req, res) {
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
    res.json(artists);
  };

// Saves a new artist, exposed at POST /artists
exports.AddNewArtist = function(req, res) {
  // Add a new artist by req.body
};

// Gets a single artist by ID, exposed at GET /artists/artistID
exports.GetArtistById = function(req, res) {
	// Return the artist in JSON format, get ID by req.params.artistId
};

// Updates a single artist by ID, exposed at PUT /artists/artistID
exports.UpdateArtistById = function(req, res) {
  // Updates the artist by ID, get ID by req.params.artistId
};

// Deletes a single artist by ID, exposed at DELETE /artists/artistID
exports.DeleteArtistById = function(req, res) {
	// Deletes the artist by ID, get ID by req.params.artistId
};