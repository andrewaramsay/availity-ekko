var _ = require('lodash');
var argv = require('minimist');

var logger = require('../logger');

var events = {
  START: 'av:started',
  STOPPED: 'av:stopped',
  REQUEST: 'av:request',
  RESPONSE: 'av:response',
  REDIRECT: 'av:redirect',
  FILE_NOT_FOUND: 'av:fileNotFound'
};

var Configuration = function() {
  this.server = null;
  this.app = null;
  this.router = null;
  this.routes = [];
  this.events = null;
  this.path = null;
  this.addressInUse = null;

  this.constants = {
    EVENTS: events
  };
};

var proto = Configuration.prototype;

/**
 * Set the path of the configuration object
 *
 * @param  {Sring} path full path to configuration. Ex: path.join(__dirname, 'config.js')

 */

proto.isProduction = function() {
  return process.env.NODE_ENV === 'production';
};

proto.isDevelopment = function() {
  return process.env.NODE_ENV === 'development';
};

proto.isTesting = function() {
  return process.env.NODE_ENV === 'testing';
};

proto.defaultConfig = function(path) {
  return this.path ? require(path) : require('../../config');
};

/**
 * Sets the configuration object from the configuration file and command line overrides.
 *
 * @param {Object} options configuration object with production|development|testing settings.
 */
proto.set = function(_options) {

  var options = _options || {};

  // Get the config object by path or from root
  if (this.path) {
    logger.info('Loading configuration file {cyan:%s}', this.path);
  }
  var config = this.path ? require(this.path) : this.defaultConfig();

  // Allow programmatic overrides for environment
  config = _.merge(config, options);

  // Pluck out environment specific config and save to `this.options`
  this.environment = process.env.NODE_ENV || 'development';
  this.options = config[this.environment];

  // Merge in any command line overrides
  var args = argv(process.argv.slice(2));

  this.options = _.merge(this.options, args);

};

proto.isProxyEnabled = function() {

  return _.some(this.options.servers, function(server) {
    return server.proxy;
  });

};

module.exports = new Configuration();
