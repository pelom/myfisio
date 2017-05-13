'use strict';
import ApplicationModulo from '../../api/application/application.modulo.model';
import nodemailer from 'nodemailer';

export default class Transport {
  send(message, callback) {
    ApplicationModulo.findOne({nome: 'Servidor Email'}, 'serveEmail')
      .exec()
      .then(modulo => {
        if(!modulo) {
          console.log('Modulo de email nao encotrado');
          return;
        }
        let emailTransportOptions = {
          service: modulo.serveEmail.service,
          auth: {
            user: modulo.serveEmail.user,
            pass: modulo.serveEmail.password
          }
        };
        let nodeMail = nodemailer.createTransport(emailTransportOptions);
        nodeMail.sendMail(message, callback);
      });
  }
}
