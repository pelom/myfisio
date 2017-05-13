'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://myfisiodev:myfisiodev@localhost:27017/myfisiodev'
  },

  logger: {
    file: {
      level: 'debug',
    },
    console: {
      level: 'debug',
    }
  },

  url: 'http://localhost:3000/',

  // Seed database on startup
  seedDB: false
};
