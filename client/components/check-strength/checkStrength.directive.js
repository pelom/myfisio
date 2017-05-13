'use strict';
import angular from 'angular';
export default angular.module('myfisioApp.checkStrength', [])
  .directive('checkStrength', function() {
    return {
      replace: false,
      restrict: 'EACM',
      link(scope, elem, attr) {
        var strength = {
          colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
          passedMatches(pass) {
            var _regex = /[$-/:-?{-~!"^_`\[\]]/g;
            var _lowerLetters = /[a-z]+/.test(pass);
            var _upperLetters = /[A-Z]+/.test(pass);
            var _numbers = /[0-9]+/.test(pass);
            var _symbols = _regex.test(pass);
            var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
            var _passed = _flags.filter(function(el) {
              return el === true;
            });
            return _passed.length;
          },
          mesureStrength(pass) {
            var _force = 0;
            var _passedMatches = this.passedMatches(pass);
            _force += 2 * pass.length + (pass.length >= 10 ? 1 : 0);
            _force += _passedMatches * 10;
            //penalizar senha curta
            _force = pass.length <= 6 ? Math.min(_force, 10) : _force;
            //penalizar variedade de caracter pobre
            _force = _passedMatches == 1 ? Math.min(_force, 10) : _force;
            _force = _passedMatches == 2 ? Math.min(_force, 20) : _force;
            _force = _passedMatches == 3 ? Math.min(_force, 40) : _force;
            return _force;
          },
          getColor(s) {
            var idx = 0;
            if(s <= 10) {
              idx = 0;
            } else if(s <= 20) {
              idx = 1;
            } else if(s <= 30) {
              idx = 2;
            } else if(s <= 40) {
              idx = 3;
            } else {
              idx = 4;
            }
            return {
              idx: idx + 1,
              col: this.colors[idx]
            };
          }
        };
        scope.$watch(attr.checkStrength, function(newValue/*, oldValue*/) {
          let formField = attr.formField || 'password';
          if(angular.isUndefined(newValue) || newValue === '') {
            elem.css({ display: 'none' });
          } else {
            var force = strength.mesureStrength(newValue);
            var score = strength.getColor(force);
            elem.css({ display: 'inline' });
            elem.children('li').css({ background: '#DDD' });
            for(var i = 0; i < score.idx; i++) {
              var item = elem.children('li')[i];
              angular.element(item).css({ background: score.col});
            }
            scope.form[formField].$setValidity('checkStrength', score.idx > 1);
          }
          if(!scope.form[formField].$error.checkStrength) {
            elem.css({ display: 'none' });
          }
        });
      },
      template: require('./strength.html')
    };
  }).name;
