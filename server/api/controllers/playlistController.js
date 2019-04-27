//'use strict';

var spotifyAuthentication = require('../../spotify-authentication');
const mongoConnection = require('../../mongo-connection');
var usersController  = require('./usersController');
var asyncPolling = require('async-polling');
const request = require('request'); // "Request" library
const reqPromise = require('request-promise');
var {PythonShell} = require('python-shell');
var moment = require('moment');

function getDate(){
		
	var today = new Date();

	var month = today.getMonth() + 1;

	var day = today.getDate();

	var hours = today.getHours();

	var minutes = today.getMinutes();

	var seconds = today.getSeconds();

	var date = today.getFullYear()+'-' + (month < 10 ? '0' + month: month)  + '-' + (day < 10 ? '0' + day: day);

	var time = (hours < 10 ? '0' + hours: hours) + '-' + (minutes < 10 ? '0' + minutes: minutes) + '-' + (seconds < 10 ? '0' + seconds: seconds);

	return (date + " " + time)
}

async function buildPlaylist(req, res){

	// In production, unmark all the comments of user details
	//if (!req.session.token){
	//	res.status(401).send('Unauthorized !! Please login');
	//}
	//else{

		userId = "stavco9@gmail.com";

		var preferredTracks = await usersController.GetPreferredTracksByUserId(userId);

	//}
}

async function listenPlaylist(req, res){
	
	// In production, unmark all the comments of user details
	//if (!req.session.token){
	//	res.status(401).send('Unauthorized !! Please login');
	//}
	//else{

		var currentTime = getDate();

		var startListeningTime = moment(req.body.startListeningTime, 'YYYY-MM-DD HH:mm:ss');

		var trackId = req.body.trackId;

		var durationOfListening = moment(currentTime, 'YYYY-MM-DD HH:mm:ss').diff(startListeningTime, 'milliseconds');

		var trackromDB = await mongoConnection.queryFromMongoDB('Tracks', {'id': trackId});

		if(trackromDB.length < 1){
			res.status(404).send("Track " + trackId + " not found");
		}
		else{
			var listeningPercent = (durationOfListening * 100 / trackromDB[0].duration_ms);

			var score = (listeningPercent - 70) / 10;

			if (req.body.isSelectedByUser == "true"){
				score += 2;
			}

			var listeningData = {
				trackId: req.body.trackId,
				email: "stavco9@gmail.com",
				//email: req.session.token.email,
				dateTime: currentTime,
				duration: durationOfListening,
				listeningPercent: listeningPercent,
				score: score,
				isListened: req.body.isListened,
				isSelectedByUser: req.body.isSelectedByUser
			};
	
			try{
				await mongoConnection.addToMongoDB('ListeningAndSuggestions', listeningData);

				//res.status(200).send(listeningData);
			}
			catch{
				res.status(500).send("Error while processing this request");	
			}
	
			res.status(200).send("success");
		}
	//}
}

var arrayUnique = function (arr) {
	return arr.filter(function(item, index){
		return arr.indexOf(item) >= index;
	});
};

module.exports = {
	buildPlaylist: buildPlaylist,
	listenPlaylist: listenPlaylist
};