export function JobResource($resource) {
  'ngInject';
  return $resource('/api/job/:id', {
    id: '@_id'
  }, {
  });
}
