'use strict';
/*eslint camelcase: 0*/
/*global google:true*/
import angular from 'angular';
export default angular.module('myfisioApp.googlemaps', [])
  .directive('googlemaps', function() {
    return {
      require: 'ngModel',
      replace: true,
      scope: {
        ngModel: '=',
        address: '=',
        city: '=',
        state: '=',
        country: '=',
        suburb: '=',
        number: '=',
        zip: '=',
      },
      template: require('./googlemaps.html'),
      link(scope, element, attrs, model) {
        let options = {
          types: [],
          componentRestrictions: { country: 'br' }
        };
        let componentForm = {
          street_number: 'short_name',
          route: 'long_name',
          sublocality_level_1: 'short_name',
          locality: 'long_name',
          administrative_area_level_1: 'short_name',
          country: 'long_name',
          postal_code: 'short_name'
        };
        let mapField = new Map();
        mapField.set('route', 'address');
        mapField.set('locality', 'city');
        mapField.set('administrative_area_level_1', 'state');
        mapField.set('postal_code', 'zip');
        mapField.set('country', 'country');
        mapField.set('sublocality_level_1', 'suburb');
        mapField.set('street_number', 'number');
        let queryResult = element.find('input');
        let el = angular.element(queryResult);
        var autocomplete = new google.maps.places.Autocomplete(el[0], options);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          scope.$apply(function() {
            var place = autocomplete.getPlace();

            mapField.forEach(v /*(v, k)*/ => {
              scope[v] = '';
            });

            for(var i = 0; i < place.address_components.length; i++) {
              var addressType = place.address_components[i].types[0];
              if(componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                var vl = mapField.get(addressType);
                if(vl) {
                  scope[vl] = val;
                }
              }
            }
            model.$setViewValue(element.val());
          });
        });
      }
    };
  }).name;
