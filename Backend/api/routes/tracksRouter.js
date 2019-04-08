'use strict';

const session = require('express-session');
const express = require('express');
const request = require('request'); // "Request" library
var cookieParser = require('cookie-parser');
const artistsController = require('../controllers/artistsController');
const tracksController = require('../controllers/tracksController');

var app = express();

module.exports = function(app) {

  app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 120000 }
      }))

  app.use(cookieParser());

  // artistsController Routes
  app.route('/tracks')
    .get(async function(req, res){
      if (!req.session.spotify_access_token){
        return res.redirect('/');
      }

      await artistsController.getAllArtists(req, res);
    })
    .post(artistsController.AddNewArtist);


  app.route('/tracks/:trackId')
    .get(artistsController.GetArtistById)
    .put(artistsController.UpdateArtistById)
    .delete(artistsController.DeleteArtistById);

  app.route('/tracks/similar/:trackId')
      .get(tracksController.GetSimilarTracksById);
};
