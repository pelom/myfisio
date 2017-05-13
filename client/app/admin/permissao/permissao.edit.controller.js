'use strict';

export default class PermissaoEditController {
  errors = {};
  /*@ngInject*/
  constructor($stateParams, $state, toastr, usSpinnerService, AplicacaoService, PermissaoService) {
    this.id = $stateParams.id;
    this.PermissaoService = PermissaoService;
    this.AplicacaoService = AplicacaoService;
    this.$state = $state;
    this.toastr = toastr;
    this.usSpinnerService = usSpinnerService;
    this.AplicacaoService.loadAppListFull(this.callbackLoadAppListFull());
    this.wait = false;
    this.situacao = this.PermissaoService.getItemIsAtivoDefault();
    this.itemRole = this.PermissaoService.getItemRoleDefault();
    this.itemSessao = this.PermissaoService.getItemSessaoDefault();
  }
  callbackLoadAppListFull() {
    return (err, appList) => {
      if(err) {
        console.log('Ex: loadAppListFull() ', err);
        this.usSpinnerService.stop('spinner-1');
        return;
      }
      this._initMapAppModulo(appList);
      if(this.id) {
        this.PermissaoService.loadProfile({ id: this.id }, this.callbackLoadProfile());
      } else {
        this.profile = this.createProfile();
        this.usSpinnerService.stop('spinner-1');
      }
    };
  }
  _initMapAppModulo(appList) {
    this.appMap = new Map();
    appList.forEach(ap => {
      ap.isCollapsed = true;
      ap.modulos.forEach(md => {
        md.select = { funcoes: [] };
        let key = ap._id.concat(':').concat(md._id);
        this.appMap.set(key, md);
      });
    });
  }
  callbackLoadProfile() {
    return (err, profile) => {
      this.usSpinnerService.stop('spinner-1');
      if(err) {
        console.log('Ex: loadProfile() ', err);
        return;
      }
      profile.permissoes.forEach(perm => {
        this.configPermissionSelect(perm);
      });
      this.profile = profile;
    };
  }
  configPermissionSelect(perm) {
    let apId = perm.application._id;
    let mdId = perm.modulo._id;
    let key = apId.concat(':').concat(mdId);
    if(this.appMap.has(key)) {
      let md = this.appMap.get(key);
      md.select = {funcoes: []};
      md.select.funcoes = perm.funcoes;
      md.select.id = perm._id;
    }
  }
  createProfile() {
    return {
      nome: '',
      descricao: '',
      role: 'user',
      tempoSessao: 1800
    };
  }
  addAllFuncoes(mod) {
    mod.select.funcoes = mod.funcoes;
  }
  removeAllFuncoes(mod) {
    mod.select.funcoes = [];
  }
  saveProfile(form) {
    if(form.$invalid) {
      return;
    }
    this.usSpinnerService.spin('spinner-1');
    this.profile.permissoes = this.createPermissionList();
    this.PermissaoService.saveProfile(this.profile)
    .then(() => {
      this.toastr.success('Perfil salvo com sucesso', `${this.profile.nome}`);
      this.$state.go('permissoes');
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
  createPermissionList() {
    let appList = this.AplicacaoService.getAppList();
    let permList = [];
    appList.forEach(app => {
      let appId = app._id;
      app.modulos.forEach(mod => {
        let perm = this.createPermission(appId, mod._id);
        permList.push(perm);
      });
    });
    return permList;
  }
  createPermission(appId, modId) {
    let key = appId.concat(':').concat(modId);
    let modul = this.appMap.get(key);
    let perm = {
      application: appId,
      modulo: modId,
      funcoes: modul.select.funcoes,
    };
    if(modul.select.id) {
      perm._id = modul.select.id;
    }
    return perm;
  }
}
