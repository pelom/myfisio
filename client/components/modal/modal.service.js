'use strict';
/*eslint prefer-reflect: 0*/
import angular from 'angular';

export function Modal($rootScope, $uibModal, $log) {
  'ngInject';
  /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the modal
   * @return {Object}            - the instance $uibModal.open() returns
   */
  function openModal(scope = {}, modalClass = 'modal-default') {
    var modalScope = $rootScope.$new();

    angular.extend(modalScope, scope);
    return $uibModal.open({
      template: scope.modal.html,
      windowClass: modalClass,
      scope: modalScope,
      controller: scope.modal.controller,
      controllerAs: scope.modal.controllerAs,
      backdrop: scope.modal.backdrop,
      keyboard: scope.modal.keyboard
    });
  }

  // Public API here
  return {

    show: {
      open(del = angular.noop) {
        return function(...arg) {
          var args = Array.prototype.slice.call(arg);
          var modal = args.shift();

          var showModal;

          showModal = openModal({
            modal
          }, 'modal-light');
          showModal.result.then(
            function(event) {
              //Reflect.apply(del, event, args);
              del.apply(event, args);
            },
            function() {
              $log.info(`Modal dismissed at: ${new Date()}`);
            });
          return showModal;
        };
      }
    },

    /* Confirmation modals */
    confirm: {

      /**
       * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
       * @param  {Function} del - callback, ran when delete is confirmed
       * @return {Function}     - the function to open the modal (ex. myModalFn)
       */
      delete(del = angular.noop) {
        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to del callback
         */
        return function(...arg) {
          var args = Array.prototype.slice.call(arg);
          var name = args.shift();
          var deleteModal;

          deleteModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Delete',
              html: `<p>Are you sure you want to delete <strong>${name}</strong> ?</p>`,
              buttons: [{
                classes: 'btn-danger',
                text: 'Delete',
                click(e) {
                  deleteModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click(e) {
                  deleteModal.dismiss(e);
                }
              }]
            }
          }, 'modal-primary');

          deleteModal.result.then(
            function(event) {
              //Reflect.apply(del, event, args);
              del.apply(event, args);
            },
            function() {
              $log.info(`Modal dismissed at: ${new Date()}`);
            });
        };
      }

    }
  };
}

export default angular.module('myfisioApp.Modal', [])
  .factory('Modal', Modal).name;
