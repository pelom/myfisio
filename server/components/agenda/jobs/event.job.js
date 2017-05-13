'use strict';

import logger from '../../logger';
import {print} from '../util';
import Event from '../../../api/event/event.model';
import User from '../../../api/user/user.model';
import {sendEventosAtradados} from '../../nodemailer';
import moment from 'moment';
import 'moment-timezone';

module.exports = function(agenda, jobFile) {
  const buscarEvent = 'Buscar eventos atrasados';

  logger.info('Carregando job file: ', jobFile);

  agenda.define(jobFile.job, function(job, done) {
    print(job);

    User.find({ isAtivo: true }, '_id email nome', {
      skip: 0, limit: 50,
      sort: {
        createdAt: 1
      }
    })
    .then(users => {
      if(users.length == 0) {
        return done();
      }
      let time = 10;
      users.forEach(item => {
        agenda.schedule(`in ${time} segunds`, buscarEvent, item);
        time += 5;
      });
      return done();
    })
    .catch(err => {
      logger.error(err);
      done(err);
    });
  });

  agenda.define(buscarEvent, function(job, done) {
    print(job);

    let user = job.attrs.data;
    let statusList = ['Pendente', 'Em Andamento'];
    let now = new Date();
    let where = {
      proprietario: user._id,
      status: { $in: statusList },
      start: { $lte: now }
    };
    let options = {
      limit: 10,
      sort: { start: -1 }
    };
    Event.find(where, '_id title start status proprietario', options)
      .then(events => {
        let eventos = [];
        if(events.length == 0) {
          return eventos;
        }

        let createEvent = function(item) {
          return {
            _id: item._id.toString(),
            proprietario: item.proprietario,
            start: formatEventDate(item.start),
            status: item.status,
            title: item.title,
          };
        };
        let formatEventDate = function(data) {
          return moment(data).tz('America/Sao_Paulo')
            .format('DD/MM/YYYY HH:mm');
        };

        events.forEach(item => {
          let evento = createEvent(item);
          eventos.push(evento);
          logger.debug('Event : ', evento);
        });
        return eventos;
      })
      .then(eventos => {
        if(eventos.length == 0) {
          done();
          return;
        }
        sendEventosAtradados(user, eventos);
        done();
      })
      .catch(err => {
        logger.error(err);
        done(err);
      });
  });

  agenda.on(`complete:${buscarEvent}`, function(job) {
    logger.debug('Job complete', job.attrs.name);
    logger.debug('Job complete', job.attrs.data);
  });
  agenda.on('ready', function() {
    logger.debug('agenda.ready() job event');
    agenda.every(jobFile.cron, jobFile.job);
  });

  return agenda;
};
