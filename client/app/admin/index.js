'use strict';

import angular from 'angular';
import routes from './admin.routes';
import AdminController from './admin.controller';
import usuario from './usuario';
import permissao from './permissao';
import aplicacao from './aplicacao';
import job from './job';

export default angular.module('myfisioApp.admin',
['myfisioApp.auth', 'ui.router', usuario, aplicacao, permissao, job])
  .config(routes)
  .controller('AdminController', AdminController).name;
