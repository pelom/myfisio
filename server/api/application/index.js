'use strict';

import {Router} from 'express';
import * as controller from './application.controller';
import * as auth from '../../auth/auth.service';
import {LER, CRIAR, MODIFICAR, /*EXCLUIR,*/ ROLE_ADMIN,
  Permissionmyfisio, isPermission} from '../api.permission.service';

let router = new Router();
let permissao = function(funcao) {
  return Permissionmyfisio('Aplicações', funcao);
};
router.get('/', isPermission(permissao(LER)), controller.index);
router.get('/showlist', isPermission(permissao(LER)), controller.showList);
router.get('/:id', isPermission(permissao(LER)), controller.show);
router.post('/', isPermission(permissao(CRIAR)), controller.create);
router.post('/:id/modulo', auth.hasRole(ROLE_ADMIN), controller.createModulo);
router.put('/:id', isPermission(permissao(MODIFICAR)), controller.update);
router.put('/:id/modulo', auth.hasRole(ROLE_ADMIN), controller.updateModulo);

module.exports = router;
