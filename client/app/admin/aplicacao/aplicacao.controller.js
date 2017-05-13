'use strict';

export default class AplicacaoController {
  errors = {};
  /*@ngInject*/
  constructor(usSpinnerService, AplicacaoService) {
    this.AplicacaoService = AplicacaoService;
    this.wait = false;
    AplicacaoService.loadAppList()
    .catch(err => {
      console.log('Ex:', err);
    })
    .finally(() => {
      usSpinnerService.stop('spinner-1');
    });
  }
  appList() {
    return this.AplicacaoService.getAppList();
  }
}
