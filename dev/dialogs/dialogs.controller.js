angular
  .module('audi')
  .controller('dialogsController', dialogsController);

function dialogsController(ngDialog, dialogsService, $rootScope, $scope, baseUrl, $route) {
  var vm = this,
      notification;

  vm.url = baseUrl + '/issues/image/';

  //QR config
  vm.qrConfig = {
    "version": 5,
    "errorCorrectionLevel": "M",
    "size": 200
  };

  vm.print = function(){
    window.print();
  };

  vm.isLoading = true;

  //get all wasteflows
  dialogsService.getAllWasteflows().success(function(result){
    vm.isLoading = false;
    vm.wasteflows = result.items;
  });

  //get all locations
  dialogsService.getAllLocations().success(function(result){
    vm.locations = result.items;
  });

  //get all departments and costcenters
  dialogsService.getAllDepartments().success(function(result){
    vm.departments = {};

    for(var i in result.items) {
      vm.departments[result.items[i].name] = result.items[i].cc_id;
    }

    dialogsService.getAllCostcenters().success(function(result){
      vm.costcenters = result.items;
    });
  });

  //when selected department changes
  vm.onChangeSelectedDepartment = function(department) {
    $scope.location.costcenter = "";
    vm.existing = false;

    for(var i in vm.costcenters) {
      if(vm.costcenters[i].id === vm.departments[department]) {
        $scope.location.costcenter = vm.costcenters[i].name;
        vm.existing = true;
      }
    }
  };

  vm.addNewContainer = function(container){
    //TODO: extend function to validate values before saving. show proper messages.

    // 1. Save to barcode table
    // 2. Get selected container type from types table
    // 3. store container in container table with barcode ID + container Type ID

    vm.containerError = "";
    vm.saving = true;

    dialogsService.saveNewBarcode(container.name).success(function(response) {
      container.bc_id = response.id;

      dialogsService.getContainerTypeByType(container.type).success(function(response) {
        container.ct_id = response.items[0].id;

        dialogsService.saveNewContainer(container).success(function(response) {
          vm.saving = false;

          notification = {
            "show": true,
            "status": "success",
            "message": "De nieuwe container werd succesvol opgeslagen."
          }; broadcastEvent(notification);

          $scope.closeThisDialog();
          $route.reload();
        });
      });
    }).error(function(response){
      vm.saving = false;
      if (response.includes("ORA-00001")) {
        //Container already exists
        vm.containerError = "Deze container naam is al in gebruik. Kies een andere naam.";
      }
    });
  };

  vm.addNewLocation = function(location){
    location.barcode = location.location + '::' + location.department + '::' + location.costcenter + '::' + location.floor + '::' + location.pillar;

    //validation function to see if a certain value exists
    //valueExists( [value to check], [table name], [key name] );

    vm.validationErrors = {
      "barcode": ""
    };

    var checkLocationBarcode = valueExists(location.barcode, 'barcodes', 'barcode');

    //check result of costcenter validation
    checkLocationBarcode.success(function(response){
      if(response.count) {
        //results found, show error message for barcodes
        vm.validationErrors.barcode = "Deze locatie bestaat al.";
      } else {
        //barcode (and therefore all other fields) is fine
        tryRequest(location);
      }
    });
  };

  vm.addNewWasteflow = function(wasteflow) {
    vm.wasteflowError = "";
    vm.saving = true;

    if(vm.wasteflows.length) {
      for(var index in vm.wasteflows) {
        if(wasteflow.nameNL.toLowerCase() === vm.wasteflows[index].name_nl.toLowerCase()) {
          vm.wasteflowError = "Deze afvalstroom werd al toegevoegd.";
          vm.saving = false;
          break;
        } else if(parseInt(index) === vm.wasteflows.length - 1) {
          //last element was reached and no duplicates were found.
          saveWasteflow(wasteflow);
        }
      }
    } else {
      //no existing wasteflows
      saveWasteflow(wasteflow);
    }
  };

  function broadcastEvent(data){
    $rootScope.$broadcast('notification-push', data);
  }

  function saveWasteflow(wasteflow) {
    dialogsService.saveNewWasteflow(wasteflow).success(function(response) {
      vm.saving = false;

      notification = {
        "show": true,
        "status": "success",
        "message": "De nieuwe afvalstroom werd succesvol opgeslagen."
      }; broadcastEvent(notification);
      $scope.closeThisDialog();

    }).error(function(response) {
      vm.saving = false;
      if (response.includes("ORA-00001")) {
        //wasteflow already exists
        vm.wasteflowError = "Deze afvalstroom werd al toegevoegd.";
      }
    });
  }

  function valueExists(data, table, key) {
    return dialogsService.checkExisting(data, table, key);
  }

  function tryRequest(location) {
    vm.saving = true;

    //all values are valid. Run storage requests
    dialogsService.saveNewBarcode(location.barcode).success(function (response) {
      location.bc_id = response.id;

      var checkCostcenter = valueExists(location.costcenter, 'cost_centers', 'name');

      checkCostcenter.success(function(response){
        if(response.count) {
          location.cc_id = response.items[0].id;
          //continue
          tryRequestDepartment(location);
        } else {
          //save new costcenter
          dialogsService.saveNewLocationCostcenter(location).success(function(response) {
            location.cc_id = response.id;
            //continue
            tryRequestDepartment(location);
          });
        }
      });
    });
  }

  function tryRequestDepartment(location) {
    var checkDepartment = valueExists(location.department, 'departments', 'name');

    checkDepartment.success(function (response) {
      if (response.count) {
        location.dep_id = response.items[0].id;
        //continue
        tryRequestLocation(location);
      } else {
        //save new department
        dialogsService.saveNewLocationDepartment(location).success(function(response) {
          location.dep_id = response.id;
          tryRequestLocation(location);
        }); //END save new Department
      }
    });
  }

  function tryRequestLocation(location) {
    var checkLocation = valueExists(location.location, 'locations', 'name');

    checkLocation.success(function (response) {
      if (response.count) {
        location.loc_id = response.items[0].id;
        linkValues(location);
      } else {
        dialogsService.saveNewLocation(location).success(function (response) {
          location.loc_id = response.id;
          linkValues(location);
        }); //END save new location
      }
    });
  }

  function linkValues(location) {
    dialogsService.linkLocDepBar(location).success(function(response){
      vm.saving = false;
      notification = {
        "show": true,
        "status": "success",
        "message": "De nieuwe locatie werd succesvol opgeslagen."
      }; broadcastEvent(notification);

      $scope.closeThisDialog();
      $route.reload();
    });
  }

}

dialogsController.$inject = ['ngDialog', 'dialogsService', '$rootScope', '$scope', 'baseUrl', '$route'];
