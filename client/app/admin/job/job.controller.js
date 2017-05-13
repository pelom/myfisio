'use strict';
import moment from 'moment';
export default class JobController {
  errors = {};
  /*@ngInject*/
  constructor($scope, $interval, JobService, usSpinnerService) {
    this.JobService = JobService;
    this.usSpinnerService = usSpinnerService;
    this.showhidden = false;
    JobService.loadJobList()
    .catch(err => {
      console.log('Ex:', err);
    })
    .finally(() => {
      usSpinnerService.stop('spinner-1');
    });
    moment.locale('pt-br');
    let timer = $interval(() => {
      this.showhidden = true;
      this.JobService.loadJobList()
      .then(jobList => {
        jobList.forEach(item => {
          if(item.lastRunAt) {
            item.lastRunAt = moment(item.lastRunAt).fromNow();
          }
          if(item.lastFinishedAt) {
            item.lastFinishedAt = moment(item.lastFinishedAt).fromNow();
          }
          if(item.nextRunAt) {
            item.nextRunAt = moment(item.nextRunAt).fromNow();
          }
        });
      })
      .catch(err => {
        console.log('Ex:', err);
      })
      .finally(() => {
        this.showhidden = false;
        //this.usSpinnerService.stop('spinner-1');
      });
    }, 2500);
    $scope.$on('$destroy', function(event) {
      console.log(event);
      $interval.cancel(timer);
    });
  }
  jobList() {
    return this.JobService.getJobList();
  }
}
