'use strict';
import angular from 'angular';
export function EventoService(EventoResource, Util) {
  'ngInject';
  let safeCb = Util.safeCb;
  let modalCtl;
  let eventoList = [];
  let evento;
  let pendente = 0;
  let emAndamento = 0;
  let concluido = 0;
  let cancelado = 0;
  let itemIsAtivo = [
    { name: 'Ativo', value: true },
    { name: 'Desativo', value: false }
  ];
  let eventoService = {
    getEvento() {
      return evento;
    },
    getEventoList() {
      return eventoList;
    },
    getItemIsAtivoDefault() {
      return itemIsAtivo;
    },
    getModalCtl() {
      return modalCtl;
    },
    setModalCtl(modCtl) {
      modalCtl = modCtl;
    },
    getNumPendente() {
      return pendente;
    },
    getNumConcluido() {
      return concluido;
    },
    getNumEmAndamento() {
      return emAndamento;
    },
    getNumCancelado() {
      return cancelado;
    },
    resetNumberResult() {
      pendente = 0;
      emAndamento = 0;
      concluido = 0;
      cancelado = 0;
    },
    setEventList(evList) {
      this.resetNumberResult();
      evList.forEach(item => {
        if(item.status === 'Pendente') {
          pendente++;
          item.color = '#f0ad4e';
          item.icon = 'fa-clock-o';
        } else if(item.status === 'Em Andamento') {
          emAndamento++;
          item.color = '#428bca';
          item.icon = 'fa-spinner';
        } else if(item.status === 'Concluído') {
          concluido++;
          item.color = '#5cb85c';
          item.icon = 'fa-check';
        } else if(item.status === 'Cancelado') {
          cancelado++;
          item.color = '#d9534f';
          item.icon = 'fa-ban';
        }
      });
    },
    loadDomain(callback) {
      return EventoResource.domain(function(data) {
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    loadCalendar(callback) {
      return EventoResource.calendar(function(data) {
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    loadEvento(ev, callback) {
      return EventoResource.get(ev, function(data) {
        evento = data;
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    loadEventoList(query, callback) {
      return EventoResource.query(query, function(data) {
        eventoList = data;
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    saveEvent(newEvent, callback) {
      let event = {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        allDay: newEvent.allDay,
        _id: newEvent._id,
        local: newEvent.local,
        descricao: newEvent.descricao,
        prioridade: newEvent.prioridade,
        status: newEvent.status,
        isAtivo: newEvent.isAtivo,
        proprietario: newEvent.proprietario,
        origin: newEvent.origin,
      };
      if(angular.isUndefined(event._id)) {
        return EventoResource.save(event, function(data) {
          evento = data;
          return safeCb(callback)(evento);
        }, function(err) {
          console.log('Ex:', err);
          return safeCb(callback)(err);
        }).$promise;
      }
      return EventoResource.update(event, function(data) {
        evento = data;
        return safeCb(callback)(evento);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    }
  };
  return eventoService;
}
