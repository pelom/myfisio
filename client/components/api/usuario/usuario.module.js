'use strict';
import angular from 'angular';
import {UsuarioService} from './usuario.service';
import {UsuarioResource} from './usuario.resource';
export default angular.module('myfisioApp.usuario.service', [])
  .factory('UsuarioService', UsuarioService)
  .factory('UsuarioResource', UsuarioResource)
  .name;
