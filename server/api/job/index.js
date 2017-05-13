'use strict';
import {Router} from 'express';
import * as controller from './job.controller';
import * as auth from '../../auth/auth.service';
import {ROLE_ADMIN} from '../api.permission.service';
module.exports = function(/*agenda*/) {
  let router = new Router();
  router.get('/', auth.hasRole(ROLE_ADMIN), controller.index);
  return router;
};
