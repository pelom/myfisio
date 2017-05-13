'use strict';

export function routerDecorator($rootScope, $location, $state, Auth) {
  'ngInject';
  // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role

  let isAuth = function(next) {
    return next.authenticate;
  };
  let isRole = function(next) {
    return typeof next.authenticate === 'string';
  };
  let hasRole = function(event, next) {
    Auth.hasRole(next.authenticate).then(has => {
      if(has) {
        return has;
      }
      event.preventDefault();

      Auth.isLoggedIn().then(is => {
        if(is) {
          hasRedirectHome();
        } else {
          hasRedirectLogin();
        }
      });
      return has;
    });
  };

  let hasLogin = function(event, next) {
    Auth.isLoggedIn().then(is => {
      if(isAuth(next) && is) {
        return;
      }
      event.preventDefault();

      if(isAuth(next) && !is) {
        hasRedirectLogin();
        return;
      } else if(is && isNextLogin(next)) {
        hasRedirectHome();
        return;
      }
    });
  };

  let hasRedirectLogin = function() {
    $state.go('login', {
      referrer: $location.url()
    });
    return true;
  };

  let isNextLogin = function(next) {
    return next.name === 'login';
  };

  let hasRedirectHome = function() {
    $state.go('home');
    return true;
  };

  $rootScope.$on('$stateChangeStart', function(event, next) {
    console.log('router: stateChangeStart: ', next);

    if(isAuth(next) && isRole(next)) {
      hasRole(event, next);
    } else {
      hasLogin(event, next);
    }
    /*if(!isAuth(next)) {
      return;
    } else if(isRole(next)) {
      hasRole(event, next);
    } else {
      hasLogin(event, next);
    }*/
  });
}
