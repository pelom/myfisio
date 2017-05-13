'use strict';
exports = module.exports = {
  // List of user roles
  userRoles: ['guest', 'user', 'admin'],
  signup: true,
  applicationDefault: {
    nome: 'myfisio',
    show: true,
    menuLeft: [
      /*{ state: 'login', title: 'Meu test', show: true }*/
    ],
    modulos: [
      { state: 'signup', title: 'Cadastre-se', icon: 'fa-edit', show: false },
      { state: 'login', nome: 'Entrar', icon: 'fa-sign-in', show: true }
    ]
  }
};
