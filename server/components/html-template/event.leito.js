import HtmlTemplate from './html.template';
import config from '../../config/environment';
export default class EventLeitoHtmlTemplate extends HtmlTemplate {
  constructor(user, events) {
    super();
    this.subject = 'Lista de eventos atrasados';
    this.data = {
      title: 'Relatório Leitos/Procedimentos',
      message: 'Atividades realizadas',
      copymark: 'PJsin 2008-2017',
      events,
      url: config.url
    };
  }
  getTemplate() {
    return this.pathResolve('./event.leito.html');
  }
}
