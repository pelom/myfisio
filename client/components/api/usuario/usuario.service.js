'use strict';
import angular from 'angular';
export function UsuarioService(Util, UsuarioResource) {
  'ngInject';
  let itemIsAtivo = [
    { name: 'Ativo', value: true },
    { name: 'Desativo', value: false }
  ];
  let safeCb = Util.safeCb;
  let usuarioService = {
    getItemIsAtivoDefault() {
      return itemIsAtivo;
    },
    loadDomain(callback) {
      return UsuarioResource.domain(function(data) {
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - function(error, user)
     * @return {Promise}
     */
    register(user, callback) {
      return UsuarioResource.register(user, function(/*data*/) {
        return safeCb(callback)(null, user);
      }, function(err) {
        return safeCb(callback)(err);
      }).$promise;
    },
    saveUser(newUser, callback) {
      console.log(newUser);
      if(angular.isUndefined(newUser._id)) {
        return UsuarioResource.save(newUser, function(/*data*/) {
          return safeCb(callback)(null, newUser);
        }, function(err) {
          return safeCb(callback)(err);
        }).$promise;
      }
      Reflect.deleteProperty(newUser, 'login');
      return UsuarioResource.update(newUser, function(data) {
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    loadUserList(callback) {
      return UsuarioResource.query(function(data) {
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    loadUser(user, callback) {
      return UsuarioResource.get(user, function(data) {
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    loadMeProfile(callback) {
      return UsuarioResource.meProfile(function(data) {
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    }
  };
  return usuarioService;
}
