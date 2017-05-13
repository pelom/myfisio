'use strict';
import EmailService from './mail.service';
import NovaContaMail from './template/nova.conta.mail';
import RedefiniSenhaMail from './template/redefinir.senha.mail';
import EventInformeMail from './template/event.informe.mail';

export function sendMailNovoConta(req, user) {
  try {
    let novaContaMail = new NovaContaMail(req, user);
    let mailService = new EmailService();
    mailService.enviar(novaContaMail, () => {
    });
  } catch(err) {
    console.log(err);
  }
}

export function sendMailRedefinirSenha(req, user) {
  try {
    let novaContaMail = new RedefiniSenhaMail(req, user);
    let mailService = new EmailService();
    mailService.enviar(novaContaMail, () => {
    });
  } catch(err) {
    console.log(err);
  }
}

export function sendEventosAtradados(user, events, callback) {
  try {
    let eventInfo = new EventInformeMail(user, events);
    let mailService = new EmailService();
    mailService.enviar(eventInfo, callback);
  } catch(err) {
    console.log(err);
    return callback(err);
  }
}
