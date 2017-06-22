angular
  .module('audi')
  .service('containerOverviewService', containerOverviewService);

function containerOverviewService(baseUrl, $http) {
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

  vm.getLastContainerAction = function() {
    var containerActionData = $http.get(baseUrl + '/container_actions/?q={"$orderby":{"creation_dt":"desc"}}&limit=1');
    return containerActionData;
  };

  vm.postLastContainerActionViewed = function(containerActionData) {
    
    var updatedContainerActionData = {
      "id": containerActionData.id,
      "at_id": containerActionData.at_id,
      "con_id": containerActionData.con_id,
      "ldx_id": containerActionData.ldx_id,
      "wf_id": containerActionData.wf_id,
      "creation_device": containerActionData.creation_device,
      "creation_dt": containerActionData.creation_dt,
      "last_modification_device": containerActionData.last_modification_device,
      "viewed": "Y"
    };

    return $http({
          url: baseUrl + '/container_actions/' + updatedContainerActionData.id,
          method: "PUT",
          data: JSON.stringify(updatedContainerActionData),
          headers: {'Content-Type': 'application/json'}
    });
  }

}

containerOverviewService.$inject = ['baseUrl', '$http'];



/*

  vm.postLastContainerActionViewed = function(containerActionData) {
    console.log(containerActionData);
    //console.log(containerActionData);
    //containerActionData.viewed="Y";

    /*
    return $http({
      url: baseUrl + '/container_actions/' + containerActionData.id,
      method: "PUT",
      data: JSON.stringify(containerActionData),
      headers: {'Content-Type': 'application/json'}
    });*/
  //}

  