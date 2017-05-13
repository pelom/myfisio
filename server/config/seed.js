/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import ApplicationModulo from '../api/application/application.modulo.model';
import Application from '../api/application/application.model';
import Profile from '../api/profile/profile.model';
import User from '../api/user/user.model';

Thing.find({}).remove()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Webpack, Gulp, Babel,'
        + 'TypeScript, Karma, Mocha, ESLint, Node Inspector, Livereload,'
        + ' Protractor, Pug, Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, '
        + 'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep '
        + 'tests alongside code. Automatic injection of scripts and '
        + 'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more '
        + 'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript '
        + 'payload, minifies your scripts/css/images, and rewrites asset '
        + 'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku '
        + 'and openshift subgenerators'
    });
  });

let createProfile = function(app) {
  Profile.find({}).remove()
    .then(() => {
      let permissionList = [];
      app.modulos.forEach(function(m) {
        permissionList.push({
          application: app._id,
          modulo: m._id,
          funcoes: m.funcoes
        });
      });
      Profile.create([{
        nome: 'Administrador sistemas',
        descricao: 'Perfil padrão responsável por fornecer as permissões para os administradores de sistemas',
        isAtivo: true,
        role: 'admin',
        permissoes: permissionList
      }, {
        nome: 'Usuário padrão',
        descricao: 'Perfil padrão responsável por fornecer as permissões para os usuários',
        isAtivo: true,
        role: 'user',
      }])
      .then(profiles => {
        console.log('finished populating Profile', profiles);
        createUser(profiles);
      });
    });
};
let createUser = function(profiles) {
  User.find({ }).remove()
    .then(() => {
      User.create([{
        provider: 'local',
        nome: 'Administrador',
        sobrenome: 'de Sistemas',
        email: 'admin@myfisio.com',
        username: 'admin@myfisio.com',
        password: 'admin',
        isAtivo: true,
        profileId: profiles[0]._id
      }])
      .then(user => {
        console.log('finished populating user', user);
      });
      User.create([{
        provider: 'local',
        nome: 'Usuário',
        sobrenome: 'Padrão',
        email: 'usuario@myfisio.com',
        username: 'usuario@myfisio.com',
        password: '123456',
        isAtivo: true,
        profileId: profiles[1]._id
      }])
      .then(user => {
        console.log('finished populating user', user);
      });
    });
};
let createApp = function(modulos) {
  Application.find({}).remove()
    .then(() => {
      Application.create({
        nome: 'myfisio',
        descricao: 'Aplicação padrão resposável por fornecer os módulos utéis',
        modulos
      }).then(app => {
        console.log('finished populating Application', app);
        createProfile(app);
      });
    });
};
let createAppModulo = function() {
  ApplicationModulo.find({}).remove()
    .then(() => {
      let fnList = ['Ler', 'Criar', 'Modificar', 'Excluir'];
      ApplicationModulo.create([
        { nome: 'Usuários', funcoes: fnList, state: 'usuario', icon: 'fa-users' },
        { nome: 'Perfis', funcoes: fnList, state: 'permissoes', icon: 'fa-cubes' },
        { nome: 'Usuário Conta', funcoes: fnList, state: 'perfil', icon: 'fa-user-circle' },
        { nome: 'Aplicações', funcoes: fnList, state: 'aplicacoes', icon: 'fa-rocket' },
        { nome: 'Módulos', funcoes: fnList, state: '', icon: 'fa-cube' }
      ])
      .then(modulos => {
        console.log('finished populating Application Modulo', modulos);
        createApp(modulos);
      });
    });
};
createAppModulo();
