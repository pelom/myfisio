'use strict';

export function authInterceptor($rootScope, $q, $cookies, $injector, Util) {
  'ngInject';

  var state;
  var toastr;
  return {
    // Add authorization token to headers
    request(config) {
      config.headers = config.headers || {};
      if($cookies.get('token') && Util.isSameOrigin(config.url)) {
        config.headers.Authorization = `Bearer ${$cookies.get('token')}`;
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError(response) {
      if(response.status === 401) {
        (state || (state = $injector.get('$state')))
        .go('logout', { referrer: 'login' });
        // remove any stale tokens
        $cookies.remove('token');
      }

      if(response.status === 403) {
        (toastr || (toastr = $injector.get('toastr')))
        .error('Você não possui as permissões necessárias para efetuar a operação.',
        'Privilégios insuficientes');
      }
      return $q.reject(response);
    }
  };
}
