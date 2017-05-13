'use strict';

import angular from 'angular';
import PermissaoController from './permissao.controller';
import PermissaoEditController from './permissao.edit.controller';
export default angular.module('myfisioApp.permissao', [])
  .controller('PermissaoEditController', PermissaoEditController)
  .controller('PermissaoController', PermissaoController).name;
