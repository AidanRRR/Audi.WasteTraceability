angular
  .module('audi')
  .service('dialogsService', dialogsService);

function dialogsService(baseUrl, $http) {
  var vm = this;

  vm.checkExisting = function(data, table, key) {
    return $http.get(baseUrl + '/' + table + '/?q={"' + key + '":"' + data.toUpperCase() + '"}');
  };

  vm.saveNewBarcode = function(barcode) {
    var data = {
      "barcode": barcode.toUpperCase(),
      "creation_user": "Audi milieudienst"
    };

    return $http({
      url: baseUrl + '/barcodes/',
      method: "POST",
      data: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    });
  };

  vm.getContainerTypeByType = function(type) {
    return $http.get(baseUrl + '/container_types/?q={"type": "' + type + '"}');
  };

  vm.saveNewContainer = function(container) {
    var data = {
      "bc_id": container.bc_id,
      "ct_id": container.ct_id,
      "name": container.name.toUpperCase(),
      "creation_user": "Audi milieudienst",
      "active": "Y"
    };

    return $http({
      url: baseUrl + '/containers/',
      method: "POST",
      data: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    });
  };

  vm.saveNewLocationCostcenter = function(location) {
    var data = {
      "name": location.costcenter.toUpperCase(),
      "creation_user": "Audi milieudienst"
    };

    return $http({
      url: baseUrl + '/cost_centers/',
      method: "POST",
      data: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    });
  };

  vm.saveNewLocationDepartment = function(location) {
    var data = {
      "cc_id": location.cc_id,
      "name": location.department.toUpperCase(),
      "creation_user": "Audi milieudienst"
    };

    return $http({
      url: baseUrl + '/departments/',
      method: "POST",
      data: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    });
  };

  vm.getAllLocations = function() {
    return $http.get(baseUrl + '/locations/');
  };

  vm.getAllDepartments = function() {
    return $http.get(baseUrl + '/departments/');
  };

  vm.getAllCostcenters = function() {
    return $http.get(baseUrl + '/cost_centers/');
  };

  vm.saveNewLocation = function(location) {
    var data = {
      "name": location.location.toUpperCase(),
      "creation_user": "Audi milieudienst"
    };

    return $http({
      url: baseUrl + '/locations/',
      method: "POST",
      data: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    });
  };

  vm.linkLocDepBar = function(location) {
    var data = {
      "loc_id": location.loc_id,
      "dep_id": location.dep_id,
      "bc_id": location.bc_id,
      "floor_code": location.floor,
      "pillar_code": location.pillar
    };

    return $http({
      url: baseUrl + '/loc_dep_xrefs/',
      method: "POST",
      data: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    });
  };

  vm.getAllWasteflows = function() {
    return $http.get(baseUrl + '/waste_flows/');
  };

  vm.saveNewWasteflow = function(wasteflow) {
    var data = {
      "name_nl": wasteflow.nameNL,
      "name_fr": wasteflow.nameFR,
      "creation_user": "Audi milieudienst"
    };

    return $http({
      url: baseUrl + '/waste_flows/',
      method: "POST",
      data: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    });
  };
}

dialogsService.$inject = ['baseUrl', '$http'];
