angular
  .module('audi')
  .service('locationOverviewService', locationOverviewService);

function locationOverviewService(baseUrl, $http) {
  var vm = this;

  vm.getAllLocations = function() {
    return $http.get(baseUrl + '/locations/full/');
  };

}

locationOverviewService.$inject = ['baseUrl', '$http'];
