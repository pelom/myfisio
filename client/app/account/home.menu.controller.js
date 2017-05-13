'use strict';
/* eslint no-sync: 0 */
export default class HomeMenuController {
  /*@ngInject*/
  constructor(Auth) {
    this.getCurrentUser = Auth.getCurrentUserSync;
  }
}
