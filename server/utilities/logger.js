const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
      level: 'debug',
      colorize: true,
      stderrLevels: ['error']
    })
  ]
});

const testLogger = new (winston.Logger)();

const getLogger = function () {
  if(process.env.NODE_ENV !== 'test') {
    return logger;
  } else {
    return testLogger;
  }
};

module.exports = getLogger;