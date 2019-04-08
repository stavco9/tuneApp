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
      cookie: { maxAge: 120000 }
      }))

  app.use(cookieParser());

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

  app.route('/tracks/similar/:trackId')
      .get(tracksController.GetSimilarTracksById);
};
