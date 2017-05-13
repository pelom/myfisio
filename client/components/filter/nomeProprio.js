'use strict';

import angular from 'angular';

angular.module('filters.nomeProprio', []);
export default angular.module('filters.nomeProprio', [])
.filter('nomeProprio', function() {
  return function(input) {
    if(!input) {
      return input;
    }
    if(input.trim().length < 2) {
      return input;
    }
    return input.charAt(0) + input.substring(1);
    //return $filter('number')(input, fractionSize);
  };
}).name;
