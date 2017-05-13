'use strict';

import angular from 'angular';
import {JobResource} from './job.resource';
import {JobService} from './job.service';

export default angular.module('myfisioApp.job.service', [])
  .factory('JobResource', JobResource)
  .factory('JobService', JobService)
  .name;
