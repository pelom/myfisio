'use strict';
/* eslint no-sync: 0 */
import angular from 'angular';

export class NavbarComponent {
  isCollapsed = true;
  constructor($rootScope, appConfig, Auth) {
    'ngInject';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.application = {show: true};

    let isNaoEstaLogando = function(logIn) {
      return !logIn;
    };
    let criarApplication = function() {
      return angular.copy(appConfig.applicationDefault);
    };

    $rootScope.$on('$stateChangeStart', (event, next) => {
      Auth.isLoggedIn(loggedIn => {
        if(isNaoEstaLogando(loggedIn)) {
          this.application = criarApplication();
        } else {
          let user = Auth.getCurrentUserSync();
          user.application.forEach(item => {
            item.show = true;
          });
          this.application = user.application[0];
        }
        if(next.name === 'signupvalid') {
          this.application.show = false;
        }
      });
    });
    /*$rootScope.$on('newapp', (event, appli) => {
      console.log('newapp', appli);
      this.application = appli;
    });
    */
  }
  activeCollapsed() {
    this.isCollapsed = true;
  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
