angular
  .module('audi')
  .controller('locationOverviewController', locationOverviewController);

function locationOverviewController(globalService, locationOverviewService, DTOptionsBuilder, ngDialog){
  var vm = this;

  globalService.setPageTitle('locatie overzicht');

  vm.tableLoading = true;

  //set options for datatable
  vm.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withPaginationType('full_numbers')
                    .withDisplayLength(1000);

  //set options for csv export
  vm.csvHeader = ['Gebouw', 'Afdeling', 'Kostenplaats', 'Barcode'];

  locationOverviewService.getAllLocations().success(function(result){
    vm.locations = [];

    for(var a in result.locations) {
      for(var b in result.locations[a].loc_dep_refs) {

        var location = {
          "location_name": result.locations[a].loc_name,
          "department_name": result.locations[a].loc_dep_refs[b].dep_name,
          "costcenter_name": result.locations[a].loc_dep_refs[b].cc_name.replace('$', ''),
          "floor": result.locations[a].loc_dep_refs[b].ldx_floor_code,
          "pillar": result.locations[a].loc_dep_refs[b].ldx_pillar_code,
          "barcode": result.locations[a].loc_dep_refs[b].bc_barcode
        };

        vm.locations.push(location);

      }
    }

    vm.tableLoading = false;
  });

  vm.viewBarcode = function(barcode) {
    ngDialog.open({
      template: 'app/dialogs/reprintBarcode.dialog.html',
      className: 'ngdialog-theme-default dialog',
      controller: 'dialogsController',
      controllerAs: 'vm',
      data: {"barcode": barcode}
    });
  };

}

locationOverviewController.$inject = ['globalService', 'locationOverviewService', 'DTOptionsBuilder', 'ngDialog'];


//$('#table-loader-locations').remove();
