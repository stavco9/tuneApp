'use strict';

const session = require('express-session');
const express = require('express');
const request = require('request'); // "Request" library
var cookieParser = require('cookie-parser');
const artistsController = require('../controllers/artistsController');

var app = express();

module.exports = function(app) {
  app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie:{ maxAge: 2*60*60*1000} // two hours
      }))

  app.use(cookieParser());
  
  // Parse URL-encoded bodies (as sent by HTML forms)
  app.use(express.urlencoded());

  // Parse JSON bodies (as sent by API clients)
  app.use(express.json());

  // artistsController Routes
  app.route('/artists')
    .get(async function(req, res){
      await artistsController.getAllArtists(req, res);
    })
    .post(artistsController.AddNewArtist);


  app.route('/artists/:artistId')
    .get(artistsController.GetArtistById)
    .put(artistsController.UpdateArtistById)
    .delete(artistsController.DeleteArtistById);

  // Body format for POST request
  //{
  //  "artistId": "dsgkkld"
  //}
  app.route('/artists/like/')
      .post(artistsController.LikeArtistById);

  // Body format for POST request
  //{
  //  "artistId": "dsgkkld"
  //}
  app.route('/artists/unlike/')
      .post(artistsController.UnlikeArtistById);

  app.route('/artists/find/:artistName').get(async function(req, res){
    await artistsController.GetArtistsByName(req, res);
  });

  //app.route('/artists/similar/:artistId')
      //.get(artistsController.GetSimilarArtistsById);

  app.route('/artists/top/:limit')
      .get(artistsController.GetTopArtists);
};
