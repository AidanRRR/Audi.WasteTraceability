angular
  .module('audi')
  .service('containerInteractionsService', containerInteractionsService);

function containerInteractionsService(baseUrl, $http) {
  var vm = this;

  vm.getAllContainers = function() {
    return $http.get(baseUrl + '/containers/full/');
  };

  vm.getAllDepartments = function() {
    return $http.get(baseUrl + '/departments/');
  };

  vm.getAllLocations = function() {
    return $http.get(baseUrl + '/locations/');
  };

  vm.getAllWasteFlows = function() {
    return $http.get(baseUrl + '/waste_flows/');
  };
}

containerInteractionsService.$inject = ['baseUrl', '$http'];