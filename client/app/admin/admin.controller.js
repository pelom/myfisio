'use strict';
/*eslint no-sync: 0*/
export default class AdminController {
  /*@ngInject*/
  constructor(Auth) {
    this.getCurrentUser = Auth.getCurrentUserSync;
  }
}
