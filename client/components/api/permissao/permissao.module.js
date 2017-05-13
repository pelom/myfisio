'use strict';

import angular from 'angular';
import {PermissaoService} from './permissao.service';
import {PermissaoResource} from './permissao.resource';

export default angular.module('myfisioApp.permissao.service', [])
  .factory('PermissaoService', PermissaoService)
  .factory('PermissaoResource', PermissaoResource)
  .name;
