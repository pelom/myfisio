'use strict';

//import PDFDocument from 'pdfkit';
import wkhtmltopdf from 'wkhtmltopdf';
import moment from 'moment';
//import fs from 'fs';
import EventHourHtml from '../html-template/event.hours';
import EventLeitoHtml from '../html-template/event.leito';

export default function EventPdf() {
  wkhtmltopdf.command = '/home/andreleite/Downloads/wkhtmltox/bin/wkhtmltopdf';
  let eventPdf = {
    generateEventProcedimento,
    generateEventLeito
  };
  return eventPdf;
}

function generateEventProcedimento(start, end, user, events, res) {
  try {
    let totalProcedimentos = 0;
    let interno = 0;
    let externo = 0;
    events.forEach(item => {
      totalProcedimentos += item.sum;
      item.itens.forEach(it => {
        if(it.convenio == 'Interno') {
          interno += it.quantidade;
        } else if(it.convenio == 'Externo') {
          externo += it.quantidade;
        }
      });
    });
    let eventHtml = new EventHourHtml(user, events);
    eventHtml.data.totalProcedimentos = totalProcedimentos;
    eventHtml.data.interno = interno;
    eventHtml.data.externo = externo;
    eventHtml.data.start = formatDate(start);
    eventHtml.data.end = formatDate(end);
    generatePdf(user, eventHtml, res);
  } catch(err) {
    console.log(err);
  }
}
function formatDate(data) {
  return moment(data).format('DD/MM/YYYY');
}
/*function createEvent(item) {
  let evento = {
    _id: item._id.toString(),
    proprietario: item.proprietario,
    start: formatEventDate(item.start),
    status: item.status,
    title: item.title,
    local: item.local,
    millesegundsDiff: 0,
    duration: '00:00:00'
  };
  if(item.end) {
    evento.millesegundsDiff = moment(item.end).diff(moment(item.start));
    var d = moment.duration(evento.millesegundsDiff);
    var h = Math.floor(d.asHours());
    evento.duration = (h < 10 ? `0${h}` : h)
      + moment.utc(evento.millesegundsDiff).format(':mm:ss');
    //item.duration = moment(moment.duration(diff)).format('HH:mm:ss');
    //item.duration = `${hourDuration} : ${minuteDuration}`;
  }
  return evento;
}*/

/*function formatHHmm(durationMille) {
  var d = moment.duration(durationMille);
  var h = Math.floor(d.asHours());
  return (h < 10 ? `0${h}` : h)
    + moment.utc(durationMille).format(':mm:ss');
}*/

/*function formatEventDate(data) {
  return moment(data).tz('America/Sao_Paulo')
    .format('DD/MM/YYYY HH:mm');
}*/

function generateEventLeito(start, end, user, events, res) {
  try {
    let totalProcedimentos = 0;
    let interno = 0;
    let externo = 0;
    events.forEach(item => {
      totalProcedimentos += item.quant;
      item.itens.forEach(it => {
        if(it.convenio == 'Interno') {
          interno += it.quantidade;
        } else if(it.convenio == 'Externo') {
          externo += it.quantidade;
        }
      });
    });
    let eventHtml = new EventLeitoHtml(user, events);
    eventHtml.data.interno = interno;
    eventHtml.data.externo = externo;
    eventHtml.data.totalProcedimentos = totalProcedimentos;
    eventHtml.data.start = formatDate(start);
    eventHtml.data.end = formatDate(end);
    generatePdf(user, eventHtml, res);
  } catch(err) {
    console.log(err);
  }
}

function generatePdf(user, eventHtml, res) {
  let config = getPdfConfig(user, eventHtml);
  let html = eventHtml.bindDataHtml();
  wkhtmltopdf(html, config).pipe(res);
}

function getPdfConfig(user, eventHtml) {
  let data = moment().local()
    .format('DD/MM/YYYY HH:mm');

  return {
    'footer-left': `${data} por ${user.nome} ${user.sobrenome}`,
    /*'header-font-size': 8,*/
    'footer-spacing': 4,
    'footer-center': `${eventHtml.data.copymark}`,
    'footer-right': 'Página [page] de [toPage]',
    'footer-font-size': 8
  };
}
