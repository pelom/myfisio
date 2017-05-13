'use strict';
import express from 'express';
import config from '../config/environment';
// Passport Configuration
require('./local/passport').setup(config);

var router = express.Router();

router.use('/local', require('./local').default);

export default router;
