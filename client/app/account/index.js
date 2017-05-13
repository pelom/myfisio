'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './account.routes';
import login from './login';
import settings from './settings';
import signup from './signup';
import perfil from './perfil';
import agenda from './agenda';
import HomeController from './home.controller';
import HomeMenuController from './home.menu.controller';
import AgendaModalController from './agenda/agenda.modal.controller';
export default angular.module('myfisioApp.account',
[uiRouter, login, settings, signup, perfil, agenda])
  .config(routing)
  .run(function($rootScope) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if(next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  })
  .controller('AgendaModalController', AgendaModalController)
  .controller('HomeMenuController', HomeMenuController)
  .controller('HomeController', HomeController).name;
