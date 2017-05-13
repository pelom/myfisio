'use strict';
import Agenda from 'agenda';
import logger from '../logger';
export default function(agendaOptions) {
  logger.info('Loading agenda...');
  logger.debug(agendaOptions);
  let agenda = new Agenda(agendaOptions);
  agendaOptions.jobFiles.forEach(function(jobFile) {
    require(`./jobs/${jobFile.name}`)(agenda, jobFile);
  });

  agenda._db = agenda._collection;
  agenda.on('start', function(job) {
    logger.info('Job %s starting', job.attrs.name);
  });
  agenda.on('complete', function(job) {
    logger.debug('Job %s finished', job.attrs.name);
  });
  agenda.on('success', function(job) {
    logger.debug('Job %s success', job.attrs.name);
  });
  agenda.on('fail', function(job) {
    logger.error('Job %s fail', job.attrs.name);
  });
  agenda.on('ready', function() {
    logger.debug('agenda.ready() start');
    agenda.start();
  });
  return agenda;
}
