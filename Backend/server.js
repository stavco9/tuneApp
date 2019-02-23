const express = require('express');
const queryString = require('query-string');
const passport = require('passport');
const session = require('express-session');
var request = require('request'); // "Request" library
var cookieParser = require('cookie-parser');

require('dotenv').config({path: __dirname+'/tuneApp.env'});

const http = require('http');

const googleAuthentication = require('./google-authentication');
const spotifyAuthentication = require('./spotify-authentication');
const mongoConnection = require('./mongo-connection');

const hostname = '127.0.0.1';
const port = 8080;

const spotifyStateKey = 'spotify_auth_state';

const app = express();

// Registering the artist routes
var routes = require('./api/routes/artistsRoutes'); 
routes(app);

//app.use(session({ secret: 'anything' }));
//app.use(passport.initialize());
//app.use(passport.session());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 120000 }
    }))

app.use(cookieParser());

app.get('/', (req, res) => {
    res.statusCode = 200;

    var googleUrl = googleAuthentication.urlGoogle();

    var spotifyUrl = spotifyAuthentication.getSpofityUrl();

    res.cookie(spotifyStateKey, queryString.parseUrl(spotifyUrl).query.state);

    if (req.session.token){
        return res.redirect('/home');
    }
    else{
        res.setHeader('Content-Type', 'text/html');
        res.end('<a href=\'' + googleUrl + '\'>Login with Google</a></br><a href=\'' + spotifyUrl + '\'>Login with Spotify</a>\n');
    }
});

app.get('/home', (req, res) => {
    res.statusCode = 200;

    var url = googleAuthentication.urlGoogle();

    if (!req.session.token){
        return res.redirect('/');
    }
    else{
        res.setHeader('Content-Type', 'application/json');

        mongoConnection.addToMongoDB('users', req.session.token);

        res.send(req.session.token);
    }
});

app.get('/google-auth', async(req, res, next) => {
    var code = queryString.parseUrl(req.url).query.code;
    
    const token = await googleAuthentication.getGoogleAccountFromCode(code);
    
    req.session.token = token;
    
    res.statusCode = 200;
    
    res.redirect('/home');
    }); 

app.get('/spotify-auth', (req, res, next) => {
    spotifyAuthentication.getAccessToken(req, res, next);
}); 
    

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});