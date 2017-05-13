export function AplicacaoResource($resource) {
  'ngInject';
  return $resource('/api/application/:id/:controller', {
    id: '@_id'
  }, {
    update: { method: 'PUT' },
    showList: {
      method: 'GET',
      isArray: true,
      params: {
        id: 'showlist'
      }
    }
  });
}
