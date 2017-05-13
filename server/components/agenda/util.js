'use strict';
import logger from '../logger';

export function print(job) {
  logger.info('Executando', job.attrs.name, new Date());
  logger.debug('Job :', job.attrs);
}
