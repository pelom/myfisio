'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login?referrer',
    referrer: 'home',
    template: require('./login/login.html'),
    controller: 'LoginController',
    controllerAs: 'vm'
  })
  .state('logout', {
    url: '/logout?referrer',
    referrer: 'main',
    template: '',
    controller($state, Auth) {
      'ngInject';

      var referrer = $state.params.referrer || $state.current.referrer || 'main';
      Auth.logout();
      $state.go(referrer);
    }
  })
  .state('signup', {
    url: '/signup',
    template: require('./signup/signup.html'),
    controller: 'SignupController',
    controllerAs: 'vm'
  })
  .state('signupvalid', {
    url: '/signupvalid?token',
    template: require('./signup/signupvalid.html')
  })
  .state('settings', {
    url: '/settings',
    template: require('./settings/settings.html'),
    controller: 'SettingsController',
    controllerAs: 'vm',
    authenticate: true
  })
  .state('settingspassword', {
    url: '/settings/password',
    template: require('./settings/settings.password.html'),
    authenticate: true
  })
  .state('perfil', {
    url: '/perfil',
    template: require('./perfil/perfil.html'),
    controller: 'PerfilController',
    controllerAs: 'ctl',
    authenticate: true
  })
  .state('homemenu', {
    url: '/home/menu',
    template: require('./home.menu.html'),
    controller: 'HomeMenuController',
    controllerAs: 'ctl',
    authenticate: true
  })
  .state('home', {
    url: '/home?defaultView&defaultDate&eventId',
    template: require('./home.html'),
    controller: 'HomeController',
    controllerAs: 'ctl',
    authenticate: true
  });
}
