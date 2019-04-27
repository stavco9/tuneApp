'use strict';

const session = require('express-session');
const express = require('express');
const request = require('request'); // "Request" library
var cookieParser = require('cookie-parser');
const playlistController = require('../controllers/playlistController');

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
  app.route('/playlist/build')
    .post(playlistController.buildPlaylist);

  // Body format for POST request
  //{
  //  "trackId": "dsgkkld",
  //  "startListeningTime": "2019-04-23 23:30:00",
  //  "isListened": "true",
  //  "isSelectedByUser": "true"
  //}
  app.route('/playlist/listen')
  .post(playlistController.listenPlaylist);
};
