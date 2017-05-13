import config from '../../config/environment';
var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.File(config.logger.file),
    new winston.transports.Console(config.logger.console)
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write(message/*, encoding*/) {
    logger.info(message);
  }
};
