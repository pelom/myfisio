'use strict';

import ApplicationModulo from './application.modulo.model';
import Application from './application.model';
import ApiService from '../api.service';

let api = ApiService();
let handleError = api.handleError;
let handleEntityNotFound = api.handleEntityNotFound;
let handleValidationError = api.handleValidationError;

const selectIndex = '_id nome descricao isAtivo criador modificador createdAt updatedAt';

export function index(req, res) {
  return api.find({
    model: 'Application',
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

const selectShow = '_id nome descricao isAtivo criador modificador createdAt updatedAt modulos';
const populationModulo = { path: 'modulos',
  populate: [api.populationCriador, api.populationModificador],
  options: { sort: { createdAt: -1 } }
};

export function show(req, res) {
  return api.findById(req.params.id, {
    model: 'Application',
    select: selectShow,
    populate: [populationModulo, api.populationCriador, api.populationModificador],
  }, res);
}

const populationShowModulo = { path: 'modulos',
  populate: [api.populationCriador, api.populationModificador],
  match: { isAtivo: true },
  options: { sort: { nome: 1 } }
};
export function showList(req, res) {
  return api.find({
    model: 'Application',
    select: selectShow,
    populate: [populationShowModulo, api.populationCriador, api.populationModificador],
    where: { isAtivo: true },
    options: { skip: 0, limit: 50,
      sort: { nome: 1 }
    }
  }, res);
}

export function create(req, res) {
  let appJson = requestCreateApplication(req);
  var newApp = new Application(appJson);
  newApp.save()
    .then(function(app) {
      res.status(201).json(app);
      return app;
    })
    .catch(handleValidationError(res));
}

function requestCreateApplication(req) {
  return {
    nome: req.body.nome,
    descricao: req.body.descricao,
    isAtivo: req.body.isAtivo,
    criador: req.user._id,
    modificador: req.user._id
  };
}

export function update(req, res) {
  let appJson = requestUpdateApplication(req);
  Application.findByIdAndUpdate(req.params.id, appJson
  ).then(handleEntityNotFound(res))
    .then(app => {
      req.params.id = app._id;
      return show(req, res);
    })
    .catch(handleError(res));
}

function requestUpdateApplication(req) {
  return {
    nome: req.body.nome,
    descricao: req.body.descricao,
    isAtivo: req.body.isAtivo,
    modificador: req.user._id
  };
}

export function createModulo(req, res) {
  Application.findById(req.params.id, '_id')
    .exec()
    .then(handleEntityNotFound(res))
    .then(callbackCreateModulo(req, res))
    .catch(handleError(res));
}
function callbackCreateModulo(req, res) {
  return function(app) {
    let moduloJson = requestCreateModulo(req);
    let newModulo = new ApplicationModulo(moduloJson);
    newModulo.save()
      .then(mod => {
        Application.findByIdAndUpdate(
          app._id, { $push: { modulos: mod._id } }, { new: true })
          .then(callbackCreateModuloApp(res, mod))
          .catch(handleError(res));
      })
      .catch(handleError(res));
  };
}

function requestCreateModulo(req) {
  return {
    nome: req.body.nome,
    descricao: req.body.descricao,
    isAtivo: Boolean(req.body.isAtivo),
    funcoes: req.body.funcoes,
    criador: req.user._id,
    modificador: req.user._id,
    application: req.params.id,
    property: req.body.property,
  };
}

function callbackCreateModuloApp(res, mod) {
  return function(/*app*/) {
    ApplicationModulo.findById(mod._id)
    .populate([api.populationCriador, api.populationModificador])
    .exec()
    .then(md => {
      res.status(201).json(md);
      return md;
    })
    .catch(handleError(res));
  };
}

export function updateModulo(req, res) {
  //let appId = req.params.id;
  let moduloJson = requestUpdateModulo(req);
  return ApplicationModulo.findByIdAndUpdate(req.body._id, moduloJson)
    .then(handleEntityNotFound(res))
    .then(callbackUpdateModulo(res))
    .catch(handleError(res));
}

function requestUpdateModulo(req) {
  return {
    nome: req.body.nome,
    descricao: req.body.descricao,
    funcoes: req.body.funcoes,
    isAtivo: req.body.isAtivo,
    modificador: req.user._id,
    property: req.body.property,
  };
}
function callbackUpdateModulo(res) {
  return function(modulo) {
    return ApplicationModulo.findById(modulo._id)
    .populate([api.populationCriador, api.populationModificador])
    .exec()
    .then(mod => {
      res.status(200).json(mod);
      return mod;
    })
    .catch(handleError(res));
  };
}
