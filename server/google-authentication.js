const {google} = require('googleapis');
require('dotenv').config({path: __dirname+'/tuneApp.env'});
const express = require('express');
const session = require('express-session');
const app = require('./index.js');

const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: process.env.GOOGLE_REDIRECT_URI // this must match your google api settings
};

/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

/*************/
/** HELPERS **/
/*************/

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}

function getGooglePlusApi(auth) {
    return google.plus({ version: 'v1', auth });
}

/**********/
/** MAIN **/

module.exports = {
    /**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
 urlGoogle: function(){
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
 },
 /**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
 getGoogleAccountFromCode: async function(code){
    const auth = createConnection();
    const data = await auth.getToken(code);
    //const data = await auth.getToken(code);
    const tokens = data.tokens;

    auth.setCredentials(tokens);
    const plus = getGooglePlusApi(auth);
    const me = await plus.people.get({ userId: 'me' });
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    const userGoogleName = me.data.displayName;
    const userGoogleFname = me.data.name.givenName;
    const userGoogleLname = me.data.name.familyName;
    const userGoogleImage = me.data.image.url;
    const userGoogleGender = me.data.gender;

    return {
        google_id: userGoogleId,
        email: userGoogleEmail,
        name: userGoogleName,
        first_name: userGoogleFname,
        last_name: userGoogleLname,
        gender: userGoogleGender,
        google_image_url: userGoogleImage
    };
 }

};