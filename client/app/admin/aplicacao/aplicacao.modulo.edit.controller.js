'use strict';
import angular from 'angular';
export default class AplicacaoModuloEditController {
  /*@ngInject*/
  constructor($scope, toastr, AplicacaoService) {
    this.toastr = toastr;
    this.AplicacaoService = AplicacaoService;
    this.modalCtl = this.AplicacaoService.getModalCtl();
    let moduloEdit = this.AplicacaoService.getModuloEdit();
    this.modulo = angular.copy(moduloEdit);
    this.modulo.select = [];
    this.modulo.funcoes.forEach(f => {
      this.modulo.select.push({
        name: f
      });
    });
    if(!this.modulo.icon) {
      this.modulo.icon = 'fa-cube';
    }
    this.itemArray = this.AplicacaoService.getItemFuncaoDefault();
    this.itemAtivo = this.AplicacaoService.getItemIsAtivoDefault();
    $scope.$watchCollection('ctl.modulo.select', function() {
      $scope.ctl.modulo.funcoes = [];
      angular.forEach($scope.ctl.modulo.select, function(value, /*key*/) {
        $scope.ctl.modulo.funcoes.push(value.name);
      });
    });
  }
  addAllFuncoes() {
    this.modulo.select = [];
    this.itemArray.forEach(item => {
      this.modulo.select.push(item);
    });
  }
  removeAllFuncoes() {
    this.modulo.select = [];
  }
  saveModulo(form) {
    if(form.$invalid || this.modulo.funcoes.length == 0) {
      return;
    }
    this.AplicacaoService.saveModulo(this.modulo)
      .then(newModulo => {
        newModulo.select = [];
        newModulo.funcoes.forEach(f => {
          newModulo.select.push({ name: f });
        });
        let moduloEdit = this.AplicacaoService.getModuloEdit();
        if(angular.isUndefined(moduloEdit.isNew) || !moduloEdit.isNew) {
          Object.assign(moduloEdit, newModulo);
        } else if(moduloEdit.isNew) {
          this.AplicacaoService.getModalCtl().onModulo(newModulo);
        }
        this.toastr.success('Módulo salvo com sucesso.', `${this.modulo.nome}`);
      })
      .catch(err => {
        console.log('Ex:', err);
      })
      .finally(() => {
        this.wait = false;
        this.modalCtl.dismiss();
      });
  }
  tagTransform(newTag) {
    var item = { id: 0, name: newTag, class: 'fa fa-tag' };
    return item;
  }
}
