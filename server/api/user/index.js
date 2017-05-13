'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';
import {LER, CRIAR, MODIFICAR,
  Permissionmyfisio, isPermission} from '../api.permission.service';
var router = new Router();
let permissao = function(funcao) {
  return Permissionmyfisio('Usuários', funcao);
};
router.get('/domain', isPermission(permissao(MODIFICAR)), controller.domain);
router.get('/', isPermission(permissao(LER)), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/me/profile', auth.isAuthenticated(), controller.meProfile);
router.get('/:id', isPermission(permissao(LER)), controller.show);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);

router.post('/', isPermission(permissao(CRIAR)), controller.create);
router.put('/:id', isPermission(permissao(MODIFICAR)), controller.update);

router.post('/register', controller.register);
router.put('/:id/signupvalid', controller.signupvalid);
router.get('/:id/signupvalid', controller.getSignupValid);

module.exports = router;
