export function EventoResource($resource) {
  'ngInject';
  return $resource('/api/event/:id/:controller', {
    id: '@_id'
  }, {
    update: { method: 'PUT' },
    domain: {
      method: 'GET',
      params: {
        id: 'domain'
      }
    },
    calendar: {
      method: 'GET',
      params: {
        id: 'calendar'
      }
    },
    pdf: {
      method: 'GET',
      headers: {
        accept: 'application/pdf'
      },
      responseType: 'arraybuffer',
      cache: true,
      transformResponse(data) {
        var pdf;
        if(data) {
          pdf = new Blob([data], {
            type: 'application/pdf'
          });
        }
        return {
          response: pdf
        };
      }
    }
  });
}
