angular
  .module('audi')
  .config(containerOverviewRoutes);

function containerOverviewRoutes($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/containerOverview/containerOverview.view.html',
      controller: 'containerOverviewController',
      controllerAs: 'vm'
    });
}

containerOverviewRoutes.$inject = ['$routeProvider'];
