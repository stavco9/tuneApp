'use strict';

const session = require('express-session');
const express = require('express');
const request = require('request'); // "Request" library
var cookieParser = require('cookie-parser');
const albumsController = require('../controllers/albumsController');

var app = express();

module.exports = function(app) {

  app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie:{ maxAge: 2*60*60*1000} // two hours
      }))

  app.use(cookieParser());

  // artistsController Routes
  app.route('/albums')
    .get(async function(req, res){
      await albumsController.getAllAlbums(req, res);
    })
    .post(albumsController.AddNewAlbum);

  app.route('/albums/:albumId')
    .get(albumsController.GetAlbumById)
    .put(albumsController.UpdateAlbumById)
    .delete(albumsController.DeleteAlbumById);
};
