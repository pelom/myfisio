'use strict';
import url from 'url';
export default class LoginController {
  user = {
    username: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $location, $state, $scope) {
    this.Auth = Auth;
    this.$state = $state;
    this.$location = $location;
    this.$scope = $scope;
    this.referrer = $state.params.referrer || $state.current.referrer || 'home';
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login({
        username: this.user.username, password: this.user.password
      })
      .then(/*user*/() => {
        let urlData = url.parse(this.referrer, true);
        this.$location.path(`${urlData.pathname}`).search(urlData.query);
      })
      .catch(err => {
        this.errors.login = err.message;
      });
    }
  }
}
