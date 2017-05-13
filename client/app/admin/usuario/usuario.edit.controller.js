'use strict';
import angular from 'angular';
export default class UsuarioEditController {
  errors = {};
  isCollapsed = true;
  /*@ngInject*/
  constructor($stateParams, $state, UsuarioService,
    PermissaoService, toastr, usSpinnerService) {
    this.id = $stateParams.id;
    this.$state = $state;
    this.toastr = toastr;
    this.usSpinnerService = usSpinnerService;
    this.UsuarioService = UsuarioService;
    this.PermissaoService = PermissaoService;
    this.UsuarioService.loadDomain().then(domain => {
      this.situacao = domain.itemIsAtivo;
      this.itemSlotDuration = domain.itemSlotDuration;
      this.businessHours = domain.businessHours;
      this.itemWeek = domain.itemWeek;
      this.itemHours = domain.itemHours;
      this.PermissaoService.loadProfileList(this.callLoadProfileList());
    });
  }
  callLoadProfileList() {
    return err => {
      if(err) {
        this.toastr.error(err.data.message, err.data.name);
        return;
      }
      if(this.id) {
        this.UsuarioService.loadUser({ id: this.id }, this.callbackLoadUser());
      } else {
        this.user = this.createUser();
        this.usSpinnerService.stop('spinner-1');
      }
    };
  }
  callbackLoadUser() {
    return (err, user) => {
      this.usSpinnerService.stop('spinner-1');
      if(err) {
        this.toastr.error(err.data.message, err.data.name);
        return;
      }
      this.user = user;
      this.user.isNotificar = false;
      if(!this.user.agenda) {
        this.user.agenda = {};
      }
      if(!this.user.agenda.businessHours) {
        this.user.agenda.businessHours = this.businessHours;
      } else {
        this.user.agenda.businessHours.forEach(item => {
          let week = this.itemWeek[item.dow[0]];
          item.name = week;
          this.businessHours[item.dow[0]] = item;
        });
        this.user.agenda.businessHours = this.businessHours;
      }
    };
  }
  createUser() {
    return {
      nome: '',
      sobrenome: '',
      username: '',
      email: '',
      telefone: '',
      celular: '',
      isNotificar: true,
      agenda: {
        startEditable: false,
        eventLimit: false,
        selectable: false,
        editable: false,
        slotDuration: '00:30:00',
        businessHours: []
      }
    };
  }
  selectOptionProfile() {
    return this.PermissaoService.getProfileList();
  }
  saveUser(form) {
    if(form.$invalid) {
      return;
    }
    let userSend = angular.copy(this.user);
    this.usSpinnerService.spin('spinner-1');
    this.UsuarioService.saveUser(userSend)
      .then(() => {
        this.toastr.success('Usuário salvo com sucesso', `${this.user.nome} ${this.user.sobrenome}`);
        this.$state.go('usuario');
      })
      .catch(err => {
        console.log('Ex:', err);
        this.toastr.error(err.data.message, err.data.name, {
          autoDismiss: false,
          closeButton: true,
          timeOut: 0,
        });
        err = err.data;
        this.errors = {};

        angular.forEach(err.errors, (error, field) => {
          if(form.hasOwnProperty(field)) {
            form[field].$setValidity('mongoose', false);
          } else {
            this.toastr.error(error.message, field, {
              closeButton: true,
            });
          }
          this.errors[field] = error.message;
        });
      })
      .finally(() => {
        this.usSpinnerService.stop('spinner-1');
      });
  }
}
