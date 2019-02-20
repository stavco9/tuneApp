'use strict';
module.exports = function(app) {
  var artistsController = require('../controllers/artistsController');

  // artistsController Routes
  app.route('/artists')
    .get(artistsController.getAllArtists)
    .post(artistsController.AddNewArtist);


  app.route('/artists/:artistId')
    .get(artistsController.GetArtistById)
    .put(artistsController.UpdateArtistById)
    .delete(artistsController.DeleteArtistById);
};
