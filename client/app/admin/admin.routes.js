'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
  .state('admin', {
    url: '/admin',
    template: require('./admin.html'),
    controller: 'AdminController',
    controllerAs: 'ctl',
    authenticate: 'admin'
  })
  .state('usuario', {
    url: '/usuario',
    template: require('./usuario/usuario.html'),
    controller: 'UsuarioController',
    controllerAs: 'ctl',
    authenticate: 'admin'
  })
  .state('usuarioedit', {
    url: '/usuario/edit/:id',
    template: require('./usuario/usuario.edit.html'),
    controller: 'UsuarioEditController',
    controllerAs: 'ctl',
    authenticate: 'admin'
  })
  .state('permissoes', {
    url: '/permissoes',
    template: require('./permissao/permissao.html'),
    controller: 'PermissaoController',
    controllerAs: 'ctl',
    authenticate: 'admin'
  })
  .state('permissoesedit', {
    url: '/permissoes/edit/:id',
    template: require('./permissao/permissao.edit.html'),
    controller: 'PermissaoEditController',
    controllerAs: 'ctl',
    authenticate: 'admin'
  })
  .state('aplicacoes', {
    url: '/aplicacoes',
    template: require('./aplicacao/aplicacao.html'),
    controller: 'AplicacaoController',
    controllerAs: 'ctl',
    authenticate: 'admin'
  })
  .state('aplicacoesedit', {
    url: '/aplicacoes/edit/:id',
    template: require('./aplicacao/aplicacao.edit.html'),
    controller: 'AplicacaoEditController',
    controllerAs: 'ctl',
    authenticate: 'admin'
  })
  .state('jobs', {
    url: '/tarefas/agendadas',
    template: require('./job/job.html'),
    controller: 'JobController',
    controllerAs: 'ctl',
    authenticate: 'admin'
  });
}
