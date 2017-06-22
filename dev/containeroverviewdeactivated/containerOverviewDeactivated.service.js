angular
  .module('audi')
  .service('containerOverviewDeactivatedService', containerOverviewDeactivatedService);

function containerOverviewDeactivatedService(baseUrl, $http) {
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

containerOverviewDeactivatedService.$inject = ['baseUrl', '$http'];
