'use strict';

export default class UsuarioController {
  /*@ngInject*/
  constructor(UsuarioService, usSpinnerService) {
    this.profiles = [];
    UsuarioService.loadUserList()
    .then(users => {
      this.users = users;
    })
    .catch(err => {
      console.log('Ex:', err);
    })
    .finally(() => {
      usSpinnerService.stop('spinner-1');
    });
  }
}
