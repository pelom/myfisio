'use strict';
import angular from 'angular';
export function AplicacaoService(Util, AplicacaoResource, AplicacaoModuloResource) {
  'ngInject';
  let safeCb = Util.safeCb;
  let modalCtl;
  let appList = [];
  let app = {};
  let modulo = {};
  let itemArray = [
    { name: 'Ler', class: 'fa fa-eye'},
    { name: 'Criar', class: 'fa fa-plus-circle' },
    { name: 'Modificar', class: 'fa fa-pencil-square-o' },
    { name: 'Excluir', class: 'fa fa-minus-circle' }
  ];
  let itemIsAtivo = [
    { name: 'Ativo', value: true },
    { name: 'Desativo', value: false }
  ];
  let aplicacaoService = {
    getApp() {
      return app;
    },
    getAppList() {
      return appList;
    },
    getItemIsAtivoDefault() {
      return itemIsAtivo;
    },
    getItemFuncaoDefault() {
      return itemArray;
    },
    getModuloEdit() {
      return modulo;
    },
    setModuloEdit(mod) {
      modulo = mod;
    },
    getModalCtl() {
      return modalCtl;
    },
    setModalCtl(modCtl) {
      modalCtl = modCtl;
    },
    loadAppListFull(callback) {
      return AplicacaoResource.showList(function(data) {
        appList = data;
        return safeCb(callback)(null, appList);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    loadApp(ap, callback) {
      return AplicacaoResource.get(ap, function(data) {
        app = data;
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    loadAppList(callback) {
      return AplicacaoResource.query(function(data) {
        appList = data;
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    saveApp(newApp, callback) {
      let appSend = {
        _id: newApp._id,
        nome: newApp.nome,
        descricao: newApp.descricao,
        isAtivo: newApp.isAtivo
      };
      if(angular.isUndefined(newApp._id)) {
        return AplicacaoResource.save(appSend, function(data) {
          app = data;
          return safeCb(callback)(app);
        }, function(err) {
          console.log('Ex:', err);
          return safeCb(callback)(err);
        }).$promise;
      }
      return AplicacaoResource.update(appSend, function(data) {
        app = data;
        return safeCb(callback)(data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    saveModulo(mod, callback) {
      let modSend = {
        _id: mod._id,
        appId: app._id,
        nome: mod.nome,
        descricao: mod.descricao,
        isAtivo: mod.isAtivo,
        funcoes: mod.funcoes,
        property: mod.property
      };
      if(angular.isUndefined(modSend._id)) {
        return AplicacaoModuloResource.save(modSend, function(data) {
          return safeCb(callback)(data);
        }, function(err) {
          console.log('Ex:', err);
          return safeCb(callback)(err);
        }).$promise;
      } else {
        return AplicacaoModuloResource.update(modSend, function(data) {
          return safeCb(callback)(data);
        }, function(err) {
          console.log('Ex:', err);
          return safeCb(callback)(err);
        }).$promise;
      }
    }
  };
  return aplicacaoService;
}
