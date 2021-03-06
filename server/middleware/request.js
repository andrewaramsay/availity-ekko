var config = require('../config');

module.exports = function requestHandler() {
  return function(req, res, next) {
    config.events.emit(config.constants.EVENTS.REQUEST, {
      req: req
    });

    next();
  };
};
