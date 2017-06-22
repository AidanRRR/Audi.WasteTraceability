angular
  .module('audi')
  .config(containerInteractionsRoutes);

function containerInteractionsRoutes($routeProvider){
  $routeProvider
    .when('/containers/interactions', {
      templateUrl: 'app/containerinteractions/containerInteractions.view.html',
      controller: 'containerInteractionsController',
      controllerAs: 'vm'
    });
}

containerInteractionsRoutes.$inject = ['$routeProvider'];
