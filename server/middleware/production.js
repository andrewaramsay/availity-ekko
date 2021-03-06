var express = require('express');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var cors = require('cors');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var _ = require('lodash');

var routes = require('../routes');
var config = require('../config');
var requestHandler = require('./request');
var notFoundHandler = require('./not.found');

module.exports = function production() {

  config.app.use(logger('short'));
  config.app.use(requestHandler());
  config.app.use(compression());
  config.app.use(methodOverride('X-HTTP-Method-Override'));
  config.app.use(cors());

  config.app.use(bodyParser.json({
    limit: _.get(config, 'options.limit', '50mb')
  })); // parse application/json

  config.app.use(bodyParser.urlencoded({  // parse application/x-www-form-urlencoded
    extended: true,
    limit: config.options.limit
  }));

  config.app.use(busboy({ immediate: true }));

  config.app.use('/', config.router);
  config.app.use('/api', config.router);
  config.app.use('/public/api', config.router);
  routes.init();

  config.app.use(notFoundHandler());

  var options = { maxAge: config.options.cache}; // one day
  config.app.use(express.static(config.options.directory, options));

};
