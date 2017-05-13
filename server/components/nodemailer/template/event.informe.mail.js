import TemplateMail from './template.mail';
import config from '../../../config/environment';
export default class EventInformeMail extends TemplateMail {
  constructor(user, events) {
    super();
    //this.from = 'andre.leite@pjsign.com.br';
    this.subject = 'Lista de eventos atrasados';
    this.to = user.email;
    this.data = {
      title: 'myfisio - Eventos',
      message: 'Resumo diário de eventos atrasados',
      copymark: 'PJsin 2008-2017',
      events,
      url: config.url
    };
  }
  getTemplate() {
    return this.pathResolve('./event.informe.mail.html');
  }
}
