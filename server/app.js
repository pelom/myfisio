/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';

import agendaJobs from './components/agenda';
//import {sendMailNovoConta} from './components/nodemailer';
// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// Populate databases with sample data
if(config.seedDB) {
  require('./config/seed.data').executar();
}

// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio').default(socketio);
require('./config/express').default(app);

let agendaOptions = Object.assign({
  db: { address: config.mongo.uri }
}, config.agenda);

let agenda = agendaJobs(agendaOptions);
/*agenda.on('ready', function() {
  //agenda.schedule('in 1 minute', 'send email report', {to: 'admin@example.com'});
  //agenda.start();
  //var weeklyReport = agenda.create('send email report', {to: 'another-guy@example.com'});
  //weeklyReport.repeatEvery('30 minutes').save();
  //agenda.start();
});*/

require('./routes').default(app, agenda);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
