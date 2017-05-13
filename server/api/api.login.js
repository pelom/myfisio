'use strict';
import User from '../api/user/user.model';
import UAParser from 'ua-parser-js';

const selectLogin = '_id nome sobrenome email username password'
  + ' salt provider isAtivo profileId';

const populationProfile = {
  path: 'profileId',
  select: '_id nome role tempoSessao',
  match: { isAtivo: true }
};

export function localAuthenticate(username, password, done) {
  User.findOne({ username: username.toLowerCase() }, selectLogin)
  .populate([populationProfile])
  .exec()
  .then(callbackLocalAuthenticate(password, done))
  .catch(err => done(err));
}

function callbackLocalAuthenticate(password, done) {
  return function(user) {
    if(!user) {
      return done(null, false, {
        message: 'Este nome de usuário não está registrado.'
      });
    }
    if(!user.isAtivo) {
      return done(null, false, {
        message: 'O Usuário não está ativo, por favor entre em contato com o administrador.'
      });
    }
    if(!user.profileId._id) {
      return done(null, false, {
        message: 'Não foi possível encontrar um perfil para o usuário'
      });
    }
    user.authenticate(password, callbackAuthenticate(user, done));
  };
}

function callbackAuthenticate(user, done) {
  return function(authError, authenticated) {
    if(authError) {
      return done(authError);
    }
    if(!authenticated) {
      return done(null, false, { message: 'Usuário ou Senha inválidos' });
    } else {
      return done(null, user);
    }
  };
}

export function registerUserLogin(req, user) {
  let userLogin = requestCreateLogin(req);
  User.findByIdAndUpdate(user._id,
    { $push: { login: { $each: [userLogin], $sort: { data: -1 } } }},
    { safe: true, upsert: true }, function(err, /*model*/) {
      console.log(err);
    }
  );
}

function requestCreateLogin(req) {
  let ip = req.ip;
  let sessionid = req.sessionID;
  let userAgent = req.headers['user-agent'];
  let userLogin = { ip, userAgent, sessionid };
  let parser = parserAgent(userAgent);
  configBrower(userLogin, parser);
  configDevice(userLogin, parser);
  configOs(userLogin, parser);
  return userLogin;
}

function configBrower(userLogin, parser) {
  if(!parser.browser) {
    return;
  }
  userLogin.browser = {};
  if(parser.browser.hasOwnProperty('name')) {
    userLogin.browser.name = parser.browser.name;
  }
  if(parser.browser.hasOwnProperty('version')) {
    userLogin.browser.version = parser.browser.version;
  }
  return userLogin;
}

function configDevice(userLogin, parser) {
  if(!parser.device) {
    return;
  }
  userLogin.device = {};
  if(parser.device.hasOwnProperty('model')) {
    userLogin.device.model = parser.device.model;
  }
  if(parser.device.hasOwnProperty('type')) {
    userLogin.device.type_ = parser.device.type;
  }
  if(parser.device.hasOwnProperty('vendor')) {
    userLogin.device.vendor = parser.device.vendor;
  }
}

function configOs(userLogin, parser) {
  if(!parser.os) {
    return;
  }
  userLogin.os = {};
  if(parser.os.hasOwnProperty('name')) {
    userLogin.os.name = parser.os.name;
  }
  if(parser.os.hasOwnProperty('version')) {
    userLogin.os.version = parser.os.version;
  }
}

function parserAgent(uAgent) {
  var parser = new UAParser();
  parser.setUA(uAgent);
  return parser.getResult();
}
