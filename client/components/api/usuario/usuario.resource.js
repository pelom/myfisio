'use strict';

export function UsuarioResource($resource) {
  'ngInject';
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    domain: {
      method: 'GET',
      params: {
        id: 'domain'
      }
    },
    meProfile: {
      method: 'GET',
      params: {
        id: 'me',
        controller: 'profile'
      }
    },
    update: { method: 'PUT' },
    register: {
      method: 'POST',
      params: {
        id: 'register'
      }
    },
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    }
  });
}
