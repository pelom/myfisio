'use strict';

export default class PermissaoController {
  errors = {};
  /*@ngInject*/
  constructor($scope, $timeout, PermissaoService, usSpinnerService) {
    this.PermissaoService = PermissaoService;
    this.usSpinnerService = usSpinnerService;
    PermissaoService.loadProfileList()
    .catch(err => {
      console.log('Ex:', err);
    })
    .finally(() => {
      usSpinnerService.stop('spinner-1');
    });
  }
  /**
   * Obter referencia a lista de Perfis
   */
  profileList() {
    return this.PermissaoService.getProfileList();
  }
}
