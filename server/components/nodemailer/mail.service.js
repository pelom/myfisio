'use strict';
import Transport from './transport';
export default class EmailService {
  constructor() {
    this.transport = new Transport();
  }

  enviar(template, callback) {
    let message = this.createMessage(template);
    this.transport.send(message, callback);
  }

  createMessage(template) {
    let html = template.bindDataHtml();
    return {
      from: template.from,
      subject: template.subject,
      to: template.to,
      html,
      generateTextFromHTML: true,
      attachments: []
    };
  }
}
