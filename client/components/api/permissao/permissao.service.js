'use strict';
import angular from 'angular';
export function PermissaoService(Util, PermissaoResource) {
  'ngInject';
  let safeCb = Util.safeCb;
  let profileList = [];
  let profile = {};
  let itemIsAtivo = [
    { name: 'Ativo', value: true },
    { name: 'Desativo', value: false }
  ];
  let itemRole = [
    { label: 'Usuário', value: 'user' },
    { label: 'Administrador', value: 'admin' }
  ];
  let itemSessao = [
    { label: '24 horas após o login', value: 60 * 60 * 24 },
    { label: '12 horas após o login', value: 60 * 60 * 12 },
    { label: '8 horas após o login', value: 60 * 60 * 8 },
    { label: '4 horas após o login', value: 60 * 60 * 4 },
    { label: '2 horas após o login', value: 60 * 60 * 2 },
    { label: '1 horas após o login', value: 60 * 60 },
    { label: '30 minutos após o login', value: 60 * 30 },
    { label: '15 minutos após o login', value: 60 * 15 }
  ];
  let permissaoService = {
    getItemIsAtivoDefault() {
      return itemIsAtivo;
    },
    getItemRoleDefault() {
      return itemRole;
    },
    getItemSessaoDefault() {
      return itemSessao;
    },
    getProfile() {
      return profile;
    },
    getProfileList() {
      return profileList;
    },
    loadProfile(prof, callback) {
      return PermissaoResource.get(prof, function(data) {
        profile = data;
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    loadProfileList(callback) {
      return PermissaoResource.query(function(data) {
        profileList = data;
        return safeCb(callback)(null, data);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
    saveProfile(newProfile, callback) {
      if(angular.isUndefined(newProfile._id)) {
        return PermissaoResource.save(newProfile, function(data) {
          profile = data;
          return safeCb(callback)(profile);
        }, function(err) {
          console.log('Ex:', err);
          return safeCb(callback)(err);
        }).$promise;
      }
      return PermissaoResource.update(newProfile, function(data) {
        profile = data;
        return safeCb(callback)(profile);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    }
  };
  return permissaoService;
}
