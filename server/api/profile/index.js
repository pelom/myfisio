'use strict';

import {Router} from 'express';
import * as controller from './profile.controller';
import {LER, CRIAR, MODIFICAR,
  Permissionmyfisio, isPermission} from '../api.permission.service';

let permissao = function(funcao) {
  return Permissionmyfisio('Perfis', funcao);
};
let router = new Router();
router.get('/', isPermission(permissao(LER)), controller.index);
router.get('/:id', isPermission(permissao(LER)), controller.show);
router.post('/', isPermission(permissao(CRIAR)), controller.create);
router.put('/:id', isPermission(permissao(MODIFICAR)), controller.update);
module.exports = router;
