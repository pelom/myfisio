'use strict';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import uiSelect from 'ui-select';
import uiMask from 'angular-ui-mask';
// import ngMessages from 'angular-messages';
import ngValidationMatch from 'angular-validation-match';

import toastr from 'angular-toastr';
import 'angular-spinner';
import 'fullcalendar/dist/locale-all';
import 'angular-i18n/angular-locale_pt-br';
import 'angular-ui-calendar';

import {routeConfig} from './app.config';

import _Auth from '../components/auth/auth.module';
import PermissaoService from '../components/api/permissao/permissao.module';
import AplicacaoService from '../components/api/aplicacao/aplicacao.module';
import UsuarioService from '../components/api/usuario/usuario.module';
import EventoService from '../components/api/evento/evento.module';
import JobService from '../components/api/job/job.module';

import account from './account';
import admin from './admin';
import changePassword from '../components/change-password/change.password.component';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import Modal from '../components/modal/modal.service';
import mongooseError from '../components/mongoose-error/mongoose-error.directive';

import loadingDirec from '../components/directive/loading/loading.directive';
import nomeValidoDirec from '../components/directive/nome-valido/nomevalido.directive';
import googlemaps from '../components/googlemaps/googlemaps.directive';
import './app.css';

import checkStrength from '../components/check-strength/checkStrength.directive';
import '../components/check-strength/check.css';

angular.module('myfisioApp', [ngCookies, ngResource, ngSanitize, ngAnimate, toastr,
  ngValidationMatch, 'btford.socket-io', loadingDirec, nomeValidoDirec, checkStrength, googlemaps,
  uiRouter, uiBootstrap, uiSelect, uiMask, UsuarioService, AplicacaoService, PermissaoService, EventoService, JobService,
  _Auth, account, admin, navbar, footer, main, constants, socket, util, Modal,
  changePassword, mongooseError, 'angularSpinner', 'ui.calendar'
])
  .config(routeConfig)
  .config(function(uiSelectConfig) {
    'ngInject';
    uiSelectConfig.theme = 'bootstrap';
    uiSelectConfig.resetSearchInput = true;
    uiSelectConfig.appendToBody = true;
  })
  .config(function(toastrConfig) {
    'ngInject';
    angular.extend(toastrConfig, {
      positionClass: 'toast-top-center'
    });
  })
  /*.run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      console.log('APP: stateChangeStart: ', next);
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  })*/;

angular.element(document).ready(() => {
  angular.bootstrap(document, ['myfisioApp'], {
    strictDi: true
  });
});
