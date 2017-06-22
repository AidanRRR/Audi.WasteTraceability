angular
  .module('audi')
  .config(containerDetailRoutes);

function containerDetailRoutes($routeProvider){
  $routeProvider
    .when('/container/:containerId', {
      templateUrl: 'app/containerdetail/containerDetail.view.html',
      controller: 'containerDetailController',
      controllerAs: 'vm'
    });
}

containerDetailRoutes.$inject = ['$routeProvider'];
