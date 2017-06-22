angular
  .module('audi')
  .config(containerOverviewDeactivatedRoutes);

function containerOverviewDeactivatedRoutes($routeProvider){
  $routeProvider
    .when('/containers/deactivated', {
      templateUrl: 'app/containeroverviewdeactivated/containerOverviewDeactivated.view.html',
      controller: 'containerOverviewDeactivatedController',
      controllerAs: 'vm'
    });
}

containerOverviewDeactivatedRoutes.$inject = ['$routeProvider'];
