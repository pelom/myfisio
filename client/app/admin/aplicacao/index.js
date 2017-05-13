'use strict';

import angular from 'angular';
import AplicacaoController from './aplicacao.controller';
import AplicacaoEditController from './aplicacao.edit.controller';
import AplicacaoModuloEditController from './aplicacao.modulo.edit.controller';
export default angular.module('myfisioApp.aplicacao', [])
  .controller('AplicacaoModuloEditController', AplicacaoModuloEditController)
  .controller('AplicacaoEditController', AplicacaoEditController)
  .controller('AplicacaoController', AplicacaoController)
  .name;
