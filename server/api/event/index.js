'use strict';

import {Router} from 'express';
import * as controller from './event.controller';
import * as auth from '../../auth/auth.service';
let router = new Router();

router.get('/pdf', auth.isAuthenticated(), controller.indexPdf);

router.get('/domain', auth.isAuthenticated(), controller.domain);
router.get('/calendar', auth.isAuthenticated(), controller.calendar);
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);

module.exports = router;
