'use strict';
import angular from 'angular';
import {openModalView} from './agenda/agenda.model.service';
import moment from 'moment';
/* eslint no-sync: 0 */
export default class HomeController {
  /*@ngInject*/
  constructor($stateParams, $location, $window, EventoService,
    toastr, usSpinnerService, Modal, appConfig, Auth) {
    this.isAdmin = Auth.isAdminSync;
    this.$stateParams = $stateParams;
    this.$window = $window;
    this.defaultView = $stateParams.defaultView || 'listDay';
    this.defaultDate = $stateParams.defaultDate || new Date();
    this.defaultStatus = $stateParams.defaultStatus || null;
    this.startInterval = null;
    this.endInterval = null;
    this.eventSources = [];
    this.toastr = toastr;
    this.usSpinnerService = usSpinnerService;
    this.Modal = Modal;
    this.EventoService = EventoService;
    this.EventoService.loadDomain().then(domain => {
      this.status = domain.status;
      this.prioridade = domain.prioridade;
    });
    this.EventoService.loadCalendar()
      .then(calendar => {
        let calendarDefault = this.createCalendar();
        const config = Object.assign(calendarDefault, calendar);
        moment.locale(config.locale);
        this.uiConfig = {
          calendar: config
        };

        if($stateParams.eventId) {
          let parse = $stateParams.eventId.split(':');
          console.log(parse);
          if(parse.length == 2 && parse[0] === 'task') {
            let event = this.createEventSelect(moment().local(), moment().local());
            event.typeTask = 'task';
            event.origin = parse[1];
            this.openModalEvent(event);
          } else {
            this.openModalEventId($stateParams.eventId);
          }
          //$location.search('eventId', null);
        }
      });
  }
  createCalendar() {
    return {
      defaultView: this.defaultView,
      defaultDate: this.defaultDate,
      loading: bool => {
        if(bool) {
          this.usSpinnerService.spin('spinner-1');
        } else {
          this.usSpinnerService.stop('spinner-1');
        }
        console.log('loading:', bool);
      },
      viewRender: view /*element*/ => {
        this.findEventListView(view);
      },
      eventRender: (event, element, view) => {
        if(view.name == 'listDay') {
          let sCell = `<b><span class="badge">${event.quantidade}</span> ${event.title}</b><br/>`;
          let sCell2 = `<span class="label label-success">${event.leito}</span> - ${event.convenio}`;
          let sCell3 = ` / <a target="_black" href="/usuario/edit/${event.proprietario._id}">${event.proprietario.nome} ${event.proprietario.sobrenome}</a>`;
          let cell = sCell + sCell2 + (this.isAdmin() ? sCell3 : '');
          element.find('td.fc-list-item-title').html(cell);
        } else {
          element.attr('title', event.start.format('LLLL'));
          //element.find('.fc-title').after('<div ></div>');
          //element.find('.fc-title').attr('popover-trigger', 'mouseenter');
          element.find('.fc-title')
            .html(`<i class="fa ${event.icon}" aria-hidden="true"></i> <b>${event.title}</b>`);
          if(event.origin) {
            element.find('.fc-title').after(
              `&nbsp;<span style="color: #777;">[${event.origin.title}]</span>`);
          }
        }

        /*if(event.start.hasZone()) {
          element.find('.fc-title').after(event.start.format('Z'));
        }*/
      },
      eventClick: calEvent/*(calEvent, jsEvent, view)*/ => {
        let event = this.createEventClick(calEvent);
        this.openModalEvent(event);
      },
      /*dayClick: date => {
        let stgStart = date.format('YYYY-MM-DD HH:mm:ss');
        let modalCtl = openModalView({
          title: 'Novo',
          start: new Date(stgStart),
          end: null
        }, this.Modal);
        this.EventoService.setModalCtl(modalCtl);
      },*/
      select: (startDate, endDate) => {
        let event = this.createEventSelect(startDate, endDate);
        this.openModalEvent(event);
      },
      eventDrop: calEvent /*(calEvent, delta, revertFunc, jsEvent, ui, view)*/ => {
        let evento = this.createEventClick(calEvent);
        this.saveEvent(evento);
      },
      eventResize: calEvent /*(calEvent, delta, revertFunc, jsEvent, ui, view)*/ => {
        let evento = this.createEventClick(calEvent);
        this.saveEvent(evento);
      }
    };
  }
  createEventClick(calEvent) {
    let evento = angular.copy(calEvent);
    console.log(evento.start);
    evento.start = this.momentToDate(evento.start);
    if(evento.end !== null) {
      evento.end = this.momentToDate(evento.end);
    }
    return evento;
  }
  momentToDate(momentDate) {
    try {
      return moment(momentDate.format()).toDate();
    } catch(err) {
      console.log(err);
      return null;
    }
  }
  createEventSelect(startDate, endDate) {
    console.log(startDate);
    let evento = {
      title: startDate.format('LLLL'),
      start: this.momentToDate(startDate),
      end: this.momentToDate(endDate),
      status: 'Pendente',
      prioridade: 'Normal'
    };
    let evList = [evento];
    this.EventoService.setEventList(evList);
    return evList[0];
  }
  openModalEvent(event) {
    let modalCtl = openModalView(event, this.Modal);
    modalCtl.defaultView = this.defaultView;
    modalCtl.defaultDate = this.defaultDate;
    this.EventoService.setModalCtl(modalCtl);
  }
  findEventListView(view) {
    this.setParamRealod(view);
    this.startInterval = view.intervalStart.local().format();
    this.endInterval = view.intervalEnd.local().format();
    this.findEventList();
  }
  findEventList() {
    this.usSpinnerService.spin('spinner-1');
    this.EventoService.loadEventoList({
      start: this.startInterval,
      end: this.endInterval,
      status: this.defaultStatus
    })
    .then(this.callbackLoadEventoList())
    .finally(() => {
      this.usSpinnerService.stop('spinner-1');
    });
  }
  setParamRealod(view) {
    this.defaultView = view.name;
    this.defaultDate = view.intervalStart.format();
  }
  callbackLoadEventoList() {
    return eventList => {
      this.EventoService.setEventList(eventList);
      let eventSource = {
        //color: '#378006', textColor: '#FFF', eventColor: '#378006',
        events: eventList,
      };
      this.eventSources.pop();
      this.eventSources.push(eventSource);
    };
  }
  findEventListStatus(status) {
    this.defaultStatus = status;
    this.findEventList();
  }
  saveEvent(evento) {
    this.usSpinnerService.spin('spinner-1');
    this.EventoService.saveEvent(evento)
    .then(newEvento => {
      this.toastr.success('Evento salvo com sucesso.', `${newEvento.title}`);
    })
    .catch(err => {
      console.log('Ex:', err);
      this.toastr.error(err.data.message, err.data.name, {
        autoDismiss: false,
        closeButton: true,
        timeOut: 0,
      });
    })
    .finally(() => {
      this.usSpinnerService.stop('spinner-1');
    });
  }
  openModalEventId(eventId) {
    this.usSpinnerService.spin('spinner-1');
    this.EventoService.loadEvento({id: eventId})
    .then(event => {
      event.start = new Date(event.start);
      if(event.end) {
        event.end = new Date(event.end);
      }
      this.openModalEvent(event);
    })
    .catch(err => {
      console.log(err);
      this.toastr.error('Não foi possível abrir o evento');
    })
    .finally(() => {
      this.usSpinnerService.stop('spinner-1');
    });
  }

  addEvento() {
    console.log('this.defaultDate;', this.defaultDate);
    let hourFormat = moment().format('HH:mm');
    let dateFormat = `${this.defaultDate} ${hourFormat}`;
    let evento = {
      start: moment(dateFormat).toDate()
    };
    this.openModalEvent(evento);
  }

  relat(url) {
    let startMoment = moment(this.startInterval);
    let start = startMoment.format('YYYY-MM-DD');
    let end = startMoment.add(24, 'hours');
    if(this.endInterval) {
      end = moment(this.endInterval).format('YYYY-MM-DD');
    }
    let urlPath = `${url}start=${start}&end=${end}`
    /*this.EventoService.pdf(start, end).then(data => {
      console.log(data);
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      //var file = new Blob([result.data], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(data);
      a.href = fileURL;
      a.download = 'fileName';
      a.click();
    });*/
    this.$window.open(urlPath, '_blank');
  }
}
