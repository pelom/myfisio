'use strict';

export function openModalView(event, Modal) {
  let modalView = createModalView(event.title);
  let showOpen = Modal.show.open();
  let modalCtl = showOpen(modalView);
  if(event !== null) {
    modalCtl.dataSource = event;
  }
  return modalCtl;
}

export function createModalView(title) {
  return {
    controller: 'AgendaModalController',
    controllerAs: 'ctl',
    dismissable: false,
    backdrop: 'static',
    keyboard: false,
    title,
    html: require('./agenda.modal.html')
  };
}
