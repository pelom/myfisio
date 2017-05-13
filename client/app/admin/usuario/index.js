'use strict';

import angular from 'angular';
import UsuarioController from './usuario.controller';
import UsuarioEditController from './usuario.edit.controller';
export default angular.module('myfisioApp.usuario', [])
  .controller('UsuarioEditController', UsuarioEditController)
  .controller('UsuarioController', UsuarioController)
  .name;
