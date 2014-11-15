'use strict';

// The Package is past automatically as first parameter
module.exports = function(Forumlogs, app, auth, database) {

  var forumlogs = require('../controllers/forumlogs');
  app.route('/forumlogs')
      .get(forumlogs.findLog)
      .post(forumlogs.create);
  app.get('/forumlogs/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/forumlogs/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/forumlogs/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/forumlogs/example/render', function(req, res, next) {
    Forumlogs.render('index', {
      package: 'forumlogs'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
