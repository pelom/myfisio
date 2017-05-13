'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  url: 'https://app-myfisio.herokuapp.com/',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'oauth-application-secret'
  },
  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  logger: {
    file: {
      level: 'info',
      filename: './logs.log',
      handleExceptions: true,
      json: false,
      maxsize: 1024 * 1024 * 2, //2MB
      maxFiles: 10,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: false,
      json: false,
      colorize: 'all',
    }
  },

  agenda: {
    //db: { address: mongo.uri },
    processEvery: '1 minutes',
    maxConcurrency: 20, //numero max de jobs execucao simultanea
    lockLimit: 0, //numero de jobs que pode ser bloqueados em qualquer momento
    defaultConcurrency: 5, //numero de jobs execucao simultanea
    defaultLockLimit: 0, //numero de jobs que pode ser bloqueados
    defaultLockLifetime: 5 * 60 * 1000, //5 minute
    jobFiles: [{
      name: 'event.job',
      cron: '0 22 * * *',
      job: 'Resumo diário de eventos atrasados'
    }]
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require(`./${process.env.NODE_ENV}.js`) || {});
