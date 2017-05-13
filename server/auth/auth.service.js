'use strict';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import {registerUserLogin} from '../api/api.login';
var validateJwt = expressJwt({
  secret: config.secrets.session
});
/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = `Bearer ${req.query.access_token}`;
      }
     // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
      if(req.query && typeof req.headers.authorization === 'undefined') {
        req.headers.authorization = `Bearer ${req.cookies.token}`;
      }
      validateJwt(req, res, next);
    });
    // Attach user to request
    /*.use(function(req, res, next) {
      User.findById(req.user._id)
        .populate({
          path: 'profileId',
          select: 'role'
        })
        .exec()
        .then(user => {
          if(!user) {
            return res.status(401).end();
          }
          req.user = user;
          next();
          return user;
        })
        .catch(err => next(err));
    });*/
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
  if(!roleRequired) {
    throw new Error('Required role needs to be set');
  }
  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if(config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        return next();
      } else {
        return res.status(403).send('Forbidden');
      }
    });
}

export function signTokenUser(user) {
  return jwt.sign({
    _id: user.id,
    nome: `${user.nome} `,
    sobrenome: `${user.sobrenome}`,
    username: `${user.username}`,
    role: user.profileId.role,
    profileId: user.profileId._id
  }, config.secrets.session, {
    expiresIn: user.profileId.tempoSessao
  });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, role) {
  return jwt.sign({ _id: id, role }, config.secrets.session, {
    //expiresIn: 60 * 60 * 5
    expiresIn: '30m'
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if(!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  var token = signToken(req.user._id, req.user.profileId.role);
  res.cookie('token', token);
  res.redirect('/');
}

export function authenticateLogin(req, user) {
  var token = signTokenUser(user);
  registerUserLogin(req, user);
  return token;
}
