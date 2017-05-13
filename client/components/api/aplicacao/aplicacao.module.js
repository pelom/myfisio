'use strict';

import angular from 'angular';
import {AplicacaoService} from './aplicacao.service';
import {AplicacaoResource} from './aplicacao.resource';
import {AplicacaoModuloResource} from './aplicacao.modulo.resource';

export default angular.module('myfisioApp.aplicacao.service', [])
  .factory('AplicacaoService', AplicacaoService)
  .factory('AplicacaoResource', AplicacaoResource)
  .factory('AplicacaoModuloResource', AplicacaoModuloResource)
  .name;
