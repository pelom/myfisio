'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class ChangePasswordComponent {
  errors = {
    other: undefined
  };
  message = '';
  /*@ngInject*/
  constructor($state, toastr, Auth) {
    'ngInject';
    this.token = $state.params.token;
    this.$state = $state;
    this.toastr = toastr;
    this.Auth = Auth;
    this.user = Auth.getCurrentUserSync();
    this.initToken();
  }
  initToken() {
    if(angular.isUndefined(this.token)) {
      return;
    }
    this.Auth.logout();
    this.Auth.getSignupValid(this.token)
      .then(user => {
        if(!user) {
          this.$state.go('login');
          return null;
        }
        if(!user.hasOwnProperty('passwordReset') || !user.passwordReset) {
          this.validateSignup();
        }
        this.user = user;
        return user;
      })
      .catch(err => {
        console.log('Ex:', err);
        this.$state.go('login');
      });
  }
  validateSignup() {
    this.Auth.signupValid(this.token, this.user.newPassword)
      .then(us => {
        if(!us) {
          this.$state.go('login');
          return null;
        }
        this.$state.go('home');
        return us;
      })
      .catch(err => {
        console.log(err);
        this.$state.go('login');
      });
  }
  changePassword(form) {
    this.submitted = true;
    if(form.$valid) {
      if(!angular.isUndefined(this.token)) {
        this.validateSignup();
      } else {
        this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
          .then(() => {
            this.message = 'Password successfully changed.';
            this.toastr.success('Operação realizada com sucesso', 'Senha alterada');
            this.user.oldPassword = '';
            this.user.newPassword = '';
            this.user.confirmPassword = '';
            form.$setPristine();
            form.$setUntouched();
          })
          .catch(() => {
            form.password.$setValidity('mongoose', false);
            this.errors.other = 'Senha inválida';
            this.message = '';
          });
      }
    }
  }
}

export default angular.module('directives.changepassword', [])
  .component('changepassword', {
    template: require('./change.password.html'),
    controller: ChangePasswordComponent,
    bindings: {
      requiredPassword: '=',
      title: '@'
    },
  })
  .name;
