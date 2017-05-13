'use strict';
import ApplicationModulo from '../api/application/application.modulo.model';
import Application from '../api/application/application.model';
import Profile from '../api/profile/profile.model';
import User from '../api/user/user.model';

export function executar() {
  let app = criarDados();
  User.find({ }).remove()
    .then(() => {
      let userAdmin = getUserAdmin(app);
      User.create(userAdmin)
      .then(callbackCreateUserAdmin(app));
    });
}

function getUserAdmin(app) {
  return app.userMap.get('Administrador');
}
function setUserAdmin(app, user) {
  app.userMap.set('Administrador', user);
  return user;
}

function callbackCreateUserAdmin(app) {
  return function(user) {
    console.log('Usuario Administrador criado:', user);
    setUserAdmin(app, user);
    Application.find({}).remove()
      .then(() => {
        let application = setUserActionCreated({
          nome: app.nome,
          descricao: app.nome.descricao
        }, user);
        Application.create(application).then(callbackCreateApp(app));
      });
  };
}

function setUserActionCreated(obj, user) {
  obj.criador = user._id;
  obj.modificador = user._id;
  return obj;
}

function callbackCreateApp(app) {
  return function(application) {
    console.log('Aplicação criada:', application);
    ApplicationModulo.find({}).remove()
      .then(() => {
        app.modulos.forEach(item => {
          item.application = application._id;
          setUserActionCreated(item, getUserAdmin(app));
        });

        ApplicationModulo.create(app.modulos)
        .then(callbackCreateModulos(app))
        .then(modulos => {
          application.modulos = modulos;
          application.save();
        });
      });
  };
}

function callbackCreateModulos(app) {
  return function(modulos) {
    console.log('Modulos criados:', modulos);
    Profile.find({}).remove()
      .then(() => {
        createProfileAdmin(app, modulos);
      });
    return modulos;
  };
}

function createProfileAdmin(app, modulos) {
  let permissionAllList = createPermissionAllList(modulos);
  let userAdmin = getUserAdmin(app);

  let profileAdmin = app.profileMap.get('Administrador');
  profileAdmin.permissoes = permissionAllList;
  setUserActionCreated(profileAdmin, userAdmin);
  Profile.create(profileAdmin)
  .then(profileAdminCreated => {
    console.log('Perfil do Administrador criado:', profileAdminCreated);
    userAdmin.profileId = profileAdminCreated._id;
    userAdmin.save();
  });
  createProfileUser(app, modulos);
}

function createPermissionAllList(modulos) {
  let permissionAllList = [];
  modulos.forEach(modulo => {
    permissionAllList.push(createPermission(modulo));
  });
  return permissionAllList;
}

function createPermission(modulo) {
  return {
    application: modulo.application,
    modulo: modulo._id,
    funcoes: modulo.funcoes
  };
}
function createProfileUser(app, modulos) {
  let profileUsuario = app.profileMap.get('Usuário');
  profileUsuario.permissoes = [createPermission(modulos[0])];
  setUserActionCreated(profileUsuario, getUserAdmin(app));
  Profile.create(profileUsuario)
  .then(profileUsuarioCreated => {
    console.log('Perfil do usario criado:', profileUsuarioCreated);
    let userUsario = app.userMap.get('Usuário');
    setUserActionCreated(userUsario, getUserAdmin(app));
    userUsario.profileId = profileUsuarioCreated._id;
    User.create(userUsario)
    .then(usuario => {
      console.log('Usuário criado', usuario);
    });
  });
}

function criarDados() {
  let funcaoList = ['Ler', 'Criar', 'Modificar', 'Excluir'];
  let moduloList = [
    { nome: 'Usuário Conta', funcoes: funcaoList, state: '', icon: 'fa-user-circle' },
    { nome: 'Usuários', funcoes: funcaoList, state: 'usuario', icon: 'fa-users' },
    { nome: 'Perfis', funcoes: funcaoList, state: 'permissoes', icon: 'fa-cubes' },
    { nome: 'Aplicações', funcoes: funcaoList, state: 'aplicacoes', icon: 'fa-rocket' },
    { nome: 'Módulos', funcoes: funcaoList, state: '', icon: 'fa-cube' },
    { nome: 'Tarefas Agendadas', funcoes: funcaoList, state: 'jobs', icon: 'fa-clock-o' },
    { nome: 'Servidor Email', funcoes: funcaoList, state: '', icon: 'fa-envelope',
      serveEmail: {
        service: 'gmail',
        user: '******@gmail.com',
        password: '******'
      }
    }
  ];

  let profileMap = new Map();
  profileMap.set('Administrador', {
    nome: 'Administrador',
    descricao: 'Perfil responsável por fornecer as permissões para os administradores da plataforma',
    isAtivo: true,
    role: 'admin'
  });
  profileMap.set('Usuário', {
    nome: 'Usuário',
    descricao: 'Perfil responsável por fornecer as permissões para os usuários da plataforma ',
    isAtivo: true, role: 'user'
  });

  let userMap = new Map();
  userMap.set('Administrador', { nome: 'Administrador', sobrenome: 'de Sistemas',
    email: 'admin@myfisio.com', username: 'admin@myfisio.com',
    password: 'admin', isAtivo: true, provider: 'local'
  });
  userMap.set('Usuário', { nome: 'Usuário', sobrenome: 'Padrão',
    email: 'usuario@myfisio.com', username: 'usuario@myfisio.com',
    password: 'usuario', isAtivo: true, provider: 'local'
  });

  return { nome: 'myfisio',
    descricao: 'Aplicação padrão resposável por fornecer os módulos utéis',
    modulos: moduloList,
    profileMap,
    userMap
  };
}
