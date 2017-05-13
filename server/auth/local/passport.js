import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {localAuthenticate} from '../../api/api.login';

export function setup(/*, config*/) {
  passport.use(new LocalStrategy({
    usernameField: 'username', passwordField: 'password'
  }, function(username, password, done) {
    return localAuthenticate(username, password, done);
  }));
}
