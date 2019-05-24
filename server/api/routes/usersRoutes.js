'use strict';

const session = require('express-session');
const express = require('express');
const request = require('request'); // "Request" library
var cookieParser = require('cookie-parser');
const usersController = require('../controllers/usersController');

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
  app.route('/users/my')
    .get(async function(req, res){
     await usersController.getMyDetails(req, res);
    })

    app.route('/users/userexist')
      .post(async function(req, res){
        await usersController.DoesUserExist(req, res)
      });

     app.route('/users/register')
    .post(async function(req, res){
      await usersController.RegisterUser(req, res)
    });
};
