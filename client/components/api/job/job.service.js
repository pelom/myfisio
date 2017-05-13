'use strict';
export function JobService(JobResource, Util) {
  'ngInject';
  let safeCb = Util.safeCb;
  let jobList = [];
  let jobService = {
    getJobList() {
      return jobList;
    },
    loadJobList(query, callback) {
      return JobResource.query(query, function(data) {
        jobList = data;
        return safeCb(callback)(null, jobList);
      }, function(err) {
        console.log('Ex:', err);
        return safeCb(callback)(err);
      }).$promise;
    },
  };
  return jobService;
}
