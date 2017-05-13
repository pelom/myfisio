'use strict';
/*eslint no-invalid-this:0*/
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';

var AgendaJobSchema = new Schema({
  name: String,
  nextRunAt: Date,
  lastRunAt: Date,
  lastFinishedAt: Date,
  failedAt: Date,
}, {collection: 'agendaJobs'});

AgendaJobSchema.virtual('isExecutando').get(function() {
  return this.lastRunAt > this.lastFinishedAt;
});
AgendaJobSchema.virtual('isAgendado').get(function() {
  return this.nextRunAt >= new Date() && this.lastRunAt < this.lastFinishedAt;
});
AgendaJobSchema.virtual('isFila').get(function() {
  return this.nextRunAt <= new Date()
    && this.nextRunAt > this.lastFinishedAt;
});
AgendaJobSchema.virtual('isCompleto').get(function() {
  if(!this.lastFinishedAt) {
    return false;
  }
  return !this.failedAt;
});
AgendaJobSchema.virtual('isFalhou').get(function() {
  return this.failedAt;
});

export default mongoose.model('AgendaJob', AgendaJobSchema);
