import HtmlTemplate from './html.template';
import config from '../../config/environment';
export default class EventHtmlTemplate extends HtmlTemplate {
  constructor(user, events) {
    super();
    this.subject = 'Lista de eventos atrasados';
    this.data = {
      title: 'Resumo de atividades realizadas',
      message: 'Atividades realizadas',
      copymark: 'PJsin 2008-2017',
      events,
      url: config.url
    };
  }
  getTemplate() {
    return this.pathResolve('./event.hours.html');
  }
}
