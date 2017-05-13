'use strict';

export function AuthResource($resource) {
  'ngInject';
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    signupvalid: {
      method: 'PUT',
      params: {
        controller: 'signupvalid'
      }
    },
    getsignupvalid: {
      method: 'GET',
      params: {
        controller: 'signupvalid'
      }
    },
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    }
  });
}
