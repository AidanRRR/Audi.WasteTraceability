angular
  .module('audi')
  .service('containerDetailService', containerDetailService);

function containerDetailService(baseUrl, $http) {
  var vm = this;

  vm.getContainerByID = function(id) {
    return $http.get(baseUrl + '/containers/full/' + id);
  };

  vm.disableContainer = function(container) {
    var containerUpdate = {
      "bc_id": container.bc_id,
      "ct_id": container.ct_id,
      "name": container.con_name,
      "active": "N"
    };

    return $http.put(baseUrl + '/containers/' + container.con_id, JSON.stringify(containerUpdate));
  };

  vm.enableContainer = function(container) {
    var containerUpdate = {
      "bc_id": container.bc_id,
      "ct_id": container.ct_id,
      "name": container.con_name,
      "active": "Y"
    };

    return $http.put(baseUrl + '/containers/' + container.con_id, JSON.stringify(containerUpdate));
  };
  

}

containerDetailService.$inject = ['baseUrl', '$http'];
