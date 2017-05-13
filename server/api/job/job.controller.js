'use strict';
import AgendaJob from './job.model';
//import ApiService from '../api.service';
//let api = ApiService();
//let handleError = api.handleError;
//let handleEntityNotFound = api.handleEntityNotFound;
//let handleValidationError = api.handleValidationError;
const selectIndex = '_id name type priority nextRunAt repeatInterval'
  + ' lastModifiedBy lockedAt lastFinishedAt lastRunAt failedAt';
export function index(req, res) {
  /*AgendaJob.count({}, function(err, count) {
    if(err) return;
    console.log(count);
  });*/
  AgendaJob.find({}, selectIndex, { skip: 0, limit: 50,
    sort: {
      lastRunAt: -1
    }
  })
  .then(result => {
    let jobList = [];
    result.forEach(item => {
      let job = createJob(item);
      if(item.isExecutando) {
        job.status = 'Executando';
      } else if(item.isAgendado) {
        job.status = 'Agendado';
      } else if(item.isFila) {
        job.status = 'Fila';
      } else if(item.isCompleto) {
        job.status = 'Completado';
      } else if(item.isFalhou) {
        job.status = 'Falhou';
      }
      jobList.push(job);
    });
    res.status(200).json(jobList);
  });
}

function createJob(job) {
  return {
    _id: job._id,
    name: job.name,
    lastRunAt: job.lastRunAt,
    lastFinishedAt: job.lastFinishedAt,
    nextRunAt: job.nextRunAt,
  };
}
