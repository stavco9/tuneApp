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
//const artistsController = require('./api/controllers/artistsController');
const tracksController = require('./api/controllers/tracksController');

const hostname = '127.0.0.1';
const port = 8080;

const spotifyStateKey = 'spotify_auth_state';

const app = express();

// Registering the artist routes
var artistRoutes = require('./api/routes/artistsRoutes'); 
artistRoutes(app);

// Registering the track routes
var trackRoutes = require('./api/routes/tracksRoutes'); 
trackRoutes(app);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{ maxAge: 7200000}
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

app.get('/home', async(req, res) => {
    res.statusCode = 200;

    var url = googleAuthentication.urlGoogle();

    if (!req.session.token){
        return res.redirect('/');
    }
    else{
        if (!req.session.spotify_access_token){
            return res.redirect('/get-spotify-token');   
        }

        res.setHeader('Content-Type', 'application/json');

        try{

            if (!req.session.userDetailsFromDB){
                req.session.userDetailsFromDB = await mongoConnection.queryFromMongoDB('users', {'email': req.session.token.email});
                //req.session.userDetailsFromDB = mongoConnection.queryFromMongoDB('users', {});
            }
                if (req.session.userDetailsFromDB.length < 1) {
                    await mongoConnection.addToMongoDB('users', req.session.token);
                } else {
                    if (req.session.token.hasOwnProperty('google_id')) {
                        if (!req.session.userDetailsFromDB[0].hasOwnProperty('google_id')) {
                            await mongoConnection.updateMongoDB('users', {'email': req.session.token.email}, req.session.token);
                        }
                    } else if (req.session.token.hasOwnProperty('spotify_id')) {
                        if (!req.session.userDetailsFromDB[0].hasOwnProperty('spotify_id')) {
                            await mongoConnection.updateMongoDB('users', {'email': req.session.token.email}, req.session.token);
                        }
                    }
                }
        }
        catch(error){
            console.log(error);
        }
        
        //artistsController.getAllArtists(req, res);

        //tracksController.tracksPolling();
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

app.get('/get-spotify-token', (req, res) =>{
    spotifyAuthentication.getAccessTokenForAPI(req, res);
});
    

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});