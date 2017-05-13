'use strict';

//import PDFDocument from 'pdfkit';
import wkhtmltopdf from 'wkhtmltopdf';
import moment from 'moment';
//import fs from 'fs';
import EventHourHtml from '../html-template/event.hours';

export default function EventPdf() {
  //wkhtmltopdf.command = '/home/andreleite/Downloads/wkhtmltox/bin/wkhtmltopdf';
  let eventPdf = {
    generateEventHour
  };
  return eventPdf;
}

function generateEventHour(user, events, res) {
  try {
    let eventos = [];
    let durationTotal = 0;
    let durationEscrito = 0;
    let durationKolekto = 0;

    events.forEach(item => {
      let evento = createEvent(item);
      durationTotal += evento.millesegundsDiff;
      if(item.local == 'Escritório') {
        durationEscrito += evento.millesegundsDiff;
      } else if(item.local == 'Kolekto') {
        durationKolekto += evento.millesegundsDiff;
      }
      eventos.push(evento);
    });

    let totalHours = formatHHmm(durationTotal);
    let hourEscritorio = formatHHmm(durationEscrito);
    let hourKolekto = formatHHmm(durationKolekto);
    let data = moment().local()
      .format('DD/MM/YYYY HH:mm');
    let eventHtml = new EventHourHtml(user, eventos);
    eventHtml.data.totalHours = totalHours;
    eventHtml.data.hourEscritorio = hourEscritorio;
    eventHtml.data.hourKolekto = hourKolekto;
    let html = eventHtml.bindDataHtml();
    wkhtmltopdf(html, {
      'footer-left': `${data} por ${user.nome} ${user.sobrenome}`,
      /*'header-font-size': 8,*/
      'footer-spacing': 4,
      'footer-center': `${eventHtml.data.copymark}`,
      'footer-right': 'Página [page] de [toPage]',
      'footer-font-size': 8
    }).pipe(res);
  } catch(err) {
    console.log(err);
  }
}

function createEvent(item) {
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
}

function formatHHmm(durationMille) {
  var d = moment.duration(durationMille);
  var h = Math.floor(d.asHours());
  return (h < 10 ? `0${h}` : h)
    + moment.utc(durationMille).format(':mm:ss');
}

function formatEventDate(data) {
  return moment(data).tz('America/Sao_Paulo')
    .format('DD/MM/YYYY HH:mm');
}
