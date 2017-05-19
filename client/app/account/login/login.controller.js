'use strict';
import url from 'url';
export default class LoginController {
  /*@ngInject*/
  constructor(Auth, $location, toastr, $state, $scope) {
    this.Auth = Auth;
    this.$state = $state;
    this.toastr = toastr;
    this.$location = $location;
    this.$scope = $scope;
    this.referrer = $state.params.referrer || $state.current.referrer || 'home';
  }

  login(form) {
    if(form.$invalid) {
      return;
    }

    this.Auth.login({
      username: this.user.username, password: this.user.password
    })
    .then(/*user*/() => {
      let urlData = url.parse(this.referrer, true);
      this.$location.path(`${urlData.pathname}`).search(urlData.query);
    })
    .catch(err => {
      console.log('Ex:', err);
      this.toastr.error(err.message);
    });
  }
}
