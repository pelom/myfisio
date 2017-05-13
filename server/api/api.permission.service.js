'use strict';
import Profile from './profile/profile.model';
import compose from 'composable-middleware';
import * as auth from '../auth/auth.service';

export const LER = 'Ler';
export const CRIAR = 'Criar';
export const MODIFICAR = 'Modificar';
export const EXCLUIR = 'Excluir';
export const APPLICATION = 'myfisio';
export const ROLE_ADMIN = 'admin';

export function Permissionmyfisio(modulo, funcao) {
  return {
    aplicacao: APPLICATION,
    modulo,
    funcao,
    role: ROLE_ADMIN
  };
}

/**
 * Verificar se o usuario tem permissao ao aplicativo
 * Caso tenho anexar lista de permissoes no request
 * Caso nao, returns 403
 */
export function isPermission(reqPermission) {
  if(!reqPermission) {
    throw new Error('Required permission');
  }
  //console.log('isPermission: ', reqPermission);
  return compose()
    .use(auth.hasRole(reqPermission.role))
    .use(hasPermission(reqPermission))
    .use(hasPermissionModuloFuncao(reqPermission));
}

function hasPermission(reqPermission) {
  const populationPermission = createPopulationPermission(reqPermission);
  return function(req, res, next) {
    Profile.findOne({ _id: req.user.profileId })
      .populate(populationPermission)
      .exec()
      .then(getPermissionList(res))
      .then(setPermissionListRequest(req, res, next))
      .catch(err => next(err));
  };
}
function createPopulationPermission(reqPermission) {
  const populationApplication = createPopulation('permissoes.application',
    reqPermission.aplicacao);
  const populationModulo = createPopulation('permissoes.modulo',
    reqPermission.modulo);
  return [populationApplication, populationModulo];
}
function createPopulation(path, nome) {
  return { path, match: { nome, isAtivo: true } };
}
function getPermissionList(res) {
  return function(profile) {
    if(!profile) {
      return res.status(401).end();
    }

    return profile.permissoes.filter(permission => {
      if(permission.application === null || permission.modulo === null) {
        return false;
      }
      return hasPermissionApplication(permission);
    });
  };
}

function hasPermissionApplication(permission) {
  let requiredModuloId = permission.modulo._id;
  let allModuloList = permission.application.modulos;
  let isMod = allModuloList.filter(function(moduloId) {
    return requiredModuloId.equals(moduloId);
  });
  return isMod.length > 0;
}

function setPermissionListRequest(req, res, next) {
  return function(permissionList) {
    if(permissionList.length == 0) {
      console.log('Permissao nao encontrada no profile: ');
      return res.status(403).send('Forbidden');
    }

    req.permissionList = permissionList;
    next();
    return permissionList;
  };
}

function hasPermissionModuloFuncao(reqPermission) {
  return function(req, res, next) {
    let perm = req.permissionList[0];
    //console.log('permissao encontrada: ', perm._id);
    //console.log('permissao requisitada: ', reqPermission);

    //A funcao solicitada nao existe no modulo?
    if(perm.modulo.funcoes.indexOf(reqPermission.funcao) < 0) {
      console.log('Permissao nao encontrada no modulo', reqPermission.funcao);
      return res.status(403).send('Forbidden');
    }
    //a funcao solicitada nao existe na permissao?
    if(perm.funcoes.indexOf(reqPermission.funcao) < 0) {
      console.log('Sem permissao:', reqPermission.funcao);
      return res.status(403).send('Forbidden');
    }
    return next();
  };
}
const populationPermission = {
  path: 'permissoes',
  select: '_id modulo application',
};
const populationApplication = {
  path: 'permissoes.application',
  match: { isAtivo: true },
  select: '_id nome',
};
const populationModulo = {
  path: 'permissoes.modulo',
  match: { isAtivo: true },
  select: '_id nome application state icon funcoes',
};
export function findAllProfilePermission(profileId, callback) {
  Profile.findOne({ _id: profileId }, 'permissoes')
    .populate([populationPermission, populationApplication, populationModulo])
    .exec()
    .then(profile => {
      if(!profile) {
        callback(null, []);
        return;
      }
      callback(null, createPermission(profile.permissoes));
      return profile;
    })
    .catch(err => {
      console.log('Ex: ', err);
      callback(err, null);
    });
}
export function createPermission(permissionList) {
  let appIdModuloListMap = new Map();
  let appMap = new Map();
  permissionList.forEach(item => {
    let appIdKey = item.application._id;
    appMap.set(appIdKey, item.application);

    let moduloList = appIdModuloListMap.get(appIdKey);
    if(!moduloList) {
      moduloList = [];
      appIdModuloListMap.set(appIdKey, moduloList);
    }
    if(isModulo(item.modulo)) {
      item.modulo.show = isMenuShow(item.modulo);
      moduloList.push(item.modulo);
    }
  });
  return convertMapArray(appMap, appIdModuloListMap);
}

function isModulo(modulo) {
  if(!modulo || !modulo.state) {
    return false;
  }
  return true;
}
function isMenuShow(modulo) {
  if(!modulo) {
    return false;
  }
  modulo.funcoes.forEach(item => {
    if(item === 'showView') {
      return true;
    }
  });
  return false;
}
function convertMapArray(appMap, appIdModuloListMap) {
  for(let application of appMap.values()) {
    let moduloList = appIdModuloListMap.get(application._id);
    application.modulos = moduloList;
  }
  return [...appMap.values()];
}
