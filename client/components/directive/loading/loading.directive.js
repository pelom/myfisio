'use strict';

import angular from 'angular';

export default angular.module('myfisioApp.loading', [])
  .directive('loading', function() {
    return {
      restrict: 'E',
      scope: {
        showhidden: '=?'
      },
      replace: true,
      template: '<i ng-show="showhidden" class="fa fa-spinner fa-spinner-animate" aria-hidden="true"></i>',
    };
  }).name;
