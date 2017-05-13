'use strict';
import {handleError, respondWithResult, handleEntityNotFound, handleValidationError} from './utils/response';
import {populationCriador, populationModificador,
  populationProfile, populationProprietario} from './utils/population';
mongoose.Promise = require('bluebird');
import mongoose from 'mongoose';
import {findAllProfilePermission} from './api.permission.service';

export default function ApiService() {
  let API = {
    find(query, res) {
      let model = mongoose.model(query.model);
      return model.find(query.where, query.select, query.options)
        .populate(query.populate)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
    },
    findById(id, query, res) {
      let model = mongoose.model(query.model);
      return model.findById(id)
        .select(query.select)
        .populate(query.populate)
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
    },
    getUserRequest(req) {
      return {
        _id: req.user._id,
        nome: req.user.nome,
        sobrenome: req.user.sobrenome,
        profileId: { role: req.user.role },
        username: req.user.username,
      };
    },
    getUserPermissionRequest(req, callback) {
      findAllProfilePermission(req.user.profileId, (err, permissoes) => {
        if(err) {
          return callback(err, null);
        }
        let user = this.getUserRequest(req);
        user.application = permissoes;
        return callback(err, user);
      });
    },
    handleError,
    respondWithResult,
    handleEntityNotFound,
    handleValidationError,
    populationCriador,
    populationModificador,
    populationProfile,
    populationProprietario,
  };
  return API;
}
