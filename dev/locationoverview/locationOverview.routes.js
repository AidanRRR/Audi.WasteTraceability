angular
  .module('audi')
  .config(locationOverviewRoutes);

function locationOverviewRoutes($routeProvider){
  $routeProvider
    .when('/locations', {
      templateUrl: 'app/locationoverview/locationOverview.view.html',
      controller: 'locationOverviewController',
      controllerAs: 'vm'
    });
}

locationOverviewRoutes.$inject = ['$routeProvider'];
