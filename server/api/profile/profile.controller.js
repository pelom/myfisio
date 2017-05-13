'use strict';

import Profile from './profile.model';
import ApiService from '../api.service';

let api = ApiService();
let handleError = api.handleError;
let handleEntityNotFound = api.handleEntityNotFound;
let handleValidationError = api.handleValidationError;

const selectIndex = '_id nome role isAtivo criador modificador createdAt updatedAt';
export function index(req, res) {
  return api.find({
    model: 'Profile',
    select: selectIndex,
    populate: [api.populationCriador, api.populationModificador],
    where: {},
    options: { skip: 0, limit: 50,
      sort: {
        createdAt: -1
      }
    }
  }, res);
}

const selectShow = '_id nome descricao tempoSessao role isAtivo criador '
  + 'modificador createdAt updatedAt permissoes';

const populationApp = {
  path: 'permissoes.application',
  select: '_id nome descricao'
};

const populationModulo = {
  path: 'permissoes.modulo',
  select: '_id nome descricao funcoes'
};

export function show(req, res) {
  return api.findById(req.params.id, {
    model: 'Profile',
    select: selectShow,
    populate: [populationApp, populationModulo, api.populationCriador, api.populationModificador],
  }, res);
}

export function create(req, res) {
  let profileJson = requestCreateProfile(req);
  var newProfile = new Profile(profileJson);
  newProfile.save()
    .then(function(profile) {
      res.status(201).json(profile);
      return profile;
    })
    .catch(handleValidationError(res));
}
function requestCreateProfile(req) {
  let permissoes = getPermissoes(req);
  return {
    nome: String(req.body.nome),
    descricao: String(req.body.descricao),
    isAtivo: req.body.isAtivo,
    criador: req.user._id,
    modificador: req.user._id,
    tempoSessao: Number(req.body.tempoSessao),
    role: String(req.body.role),
    permissoes
  };
}
function getPermissoes(req) {
  return req.body.permissoes.filter(item => item.funcoes.length > 0);
}
export function update(req, res) {
  let profileJson = requestUpdateProfile(req);
  Profile.findByIdAndUpdate(req.params.id, profileJson, { safe: true })
  .then(handleEntityNotFound(res))
  .then(profile => {
    req.params.id = profile._id;
    return show(req, res);
  })
  .catch(handleError(res));
}

function requestUpdateProfile(req) {
  let permissoes = getPermissoes(req);
  return {
    nome: String(req.body.nome),
    descricao: String(req.body.descricao),
    isAtivo: req.body.isAtivo,
    modificador: req.user._id,
    tempoSessao: Number(req.body.tempoSessao),
    permissoes
  };
}
