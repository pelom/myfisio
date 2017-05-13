export function AplicacaoModuloResource($resource) {
  'ngInject';
  return $resource('/api/application/:appId/:controller', {
    appId: '@appId'
  }, {
    update: {
      method: 'PUT',
      params: {
        controller: 'modulo'
      }
    },
    save: {
      method: 'POST',
      params: {
        controller: 'modulo'
      }
    }
  });
}
