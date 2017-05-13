'use strict';
import angular from 'angular';
export default class AplicacaoEditController {
  /*@ngInject*/
  constructor($stateParams, $timeout, $state, toastr, usSpinnerService, AplicacaoService, Modal) {
    this.id = $stateParams.id;
    this.$state = $state;
    this.toastr = toastr;
    this.usSpinnerService = usSpinnerService;
    this.AplicacaoService = AplicacaoService;
    this.Modal = Modal;
    this.modulo = {};
    if(this.id) {
      this.AplicacaoService.loadApp({ id: this.id })
        .then(app => {
          this.app = app;
          this.app.modulos.forEach(m => {
            m.select = [];
            if(!m.icon) {
              m.icon = 'fa-cube';
            }
            m.funcoes.forEach(f => {
              m.select.push({ name: f });
            });
          });
        })
        .finally(() => {
          this.usSpinnerService.stop('spinner-1');
        });
    } else {
      this.app = this._createApp();
      $timeout(() => {
        this.usSpinnerService.stop('spinner-1');
      }, 100);
    }
    this.itemArray = this.AplicacaoService.getItemFuncaoDefault();
    this.situacao = this.AplicacaoService.getItemIsAtivoDefault();
  }
  _createApp() {
    return {
      nome: '',
      descricao: '',
      modulos: [],
      isAtivo: true
    };
  }
  editModulo(modulo) {
    let modalTitle = 'Modulo de aplicação';
    let modal = this._createModalEditModulo(modalTitle);
    let showOpen = this.Modal.show.open();
    let modalCtl = showOpen(modal);
    if(angular.isUndefined(modulo)) {
      modulo = this._createModulo();
      modalCtl.onModulo = modEdit => {
        modEdit.isNew = false;
        this.app.modulos.push(modEdit);
      };
    }
    this.AplicacaoService.setModuloEdit(modulo);
    this.AplicacaoService.setModalCtl(modalCtl);
  }
  _createModalEditModulo(modalTitle) {
    return {
      controller: 'AplicacaoModuloEditController',
      controllerAs: 'ctl',
      dismissable: true,
      title: modalTitle,
      html: require('./aplicacao.modulo.edit.html'),
    };
  }
  _createModulo() {
    return {
      nome: '',
      descricao: '',
      funcoes: [],
      select: [],
      isAtivo: true,
      isNew: true
    };
  }
  tagTransform(newTag) {
    var item = { id: 0, name: newTag, class: 'fa fa-tag' };
    return item;
  }
  saveApp(form) {
    if(form.$invalid) {
      return;
    }
    this.usSpinnerService.spin('spinner-1');
    this.AplicacaoService.saveApp(this.app)
    .then(newApp => {
      let isUpdate = this.app._id;
      this.app = newApp;
      if(isUpdate) {
        this.$state.go('aplicacoes');
      } else {
        this.toastr.info('Adicione os módulos para aplicação clicando em Novo.', 'Módulos da aplicação');
      }
      this.toastr.success('Aplicação salva com sucesso.', `${this.app.nome}`);
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
      this.wait = false;
      this.usSpinnerService.stop('spinner-1');
    });
  }
}
