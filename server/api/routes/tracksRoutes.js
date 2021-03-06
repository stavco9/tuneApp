'use strict';

const session = require('express-session');
const express = require('express');
const request = require('request'); // "Request" library
var cookieParser = require('cookie-parser');
const tracksController = require('../controllers/tracksController');

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
  app.route('/tracks')
    .get(async function(req, res){
      await tracksController.getAllTracks(req, res);
    })
    .post(tracksController.AddNewTrack);

  // artistsController Routes
  app.route('/tracks/features')
  .get(async function(req, res){
    await tracksController.getAllAudioFeatures(req, res);
  });
  //.post(tracksController.AddNewAudioFeature);

  app.route('/tracks/:trackId')
    .get(tracksController.GetTrackById)
    .put(tracksController.UpdateTrackById)
    .delete(tracksController.DeleteTrackById);

  // Body format for POST request
  //{
  //  "trackId": "dsgkkld"
  //}
  app.route('/tracks/like/')
      .post(tracksController.LikeTrackById);

  // Body format for POST request
  //{
  //  "trackId": "dsgkkld"
  //}
  app.route('/tracks/unlike/')
      .post(tracksController.UnlikeTrackById);

  app.route('/tracks/similar/:trackId')
      .get(tracksController.GetSimilarTracksById);

  app.route('/tracks/top/:limit')
      .get(tracksController.GetTopTracks);
};
