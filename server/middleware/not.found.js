var config = require('../config');

module.exports = function notfound() {

  return function(req, res) {

    res.status(404);

    config.events.emit(config.constants.EVENTS.FILE_NOT_FOUND, {
      req: req
    });

    var message = 'Not Found';

    if (req.accepts('html')) {
      res.type('html').status(404).end('<!DOCTYPE html> <html> <head> <title>Dummy Mock Server Response</title> </head> <body> <h1>Not Found<h1> </body> </html>');
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.type('json').send({ error: message });
      return;
    }

    // respond with json
    if (req.accepts('xml')) {
      res.type('xml').send('<error><message>' + message + '</message></error>');
      return;
    }

    // default to plain-text. send()
    res.type('txt').send({ error: message });
  };
};
