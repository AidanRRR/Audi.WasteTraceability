angular
  .module('audi')
  .controller('containerOverviewDeactivatedController', containerOverviewDeactivatedController);

function containerOverviewDeactivatedController(globalService, containerOverviewDeactivatedService, DTOptionsBuilder){
  var vm = this;

  vm.tableLoading = true;

  //page specific configs
  globalService.setPageTitle('Gedeactiveerde containers');
  vm.filterPanel = 'app/containeroverviewdeactivated/filter.view.html';

  //set options for datatable
  vm.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withPaginationType('full_numbers')
                    .withDisplayLength(1000)
                    .withOption('order', [6, 'desc']);

  //set options for csv export
  vm.csvHeader = ['Id', 'Status', 'Container #', 'Kleur', 'Afvalstroom', 'Afdeling', 'Gebouw', 'Laatste leging', 'Probleem', 'Probleem'];

  vm.filteredContainers;

  containerOverviewDeactivatedService.getAllContainers().success(function(result){
    var wrongsort,
        damagedcont;

    vm.containers = [];

    //first cleanup step. Remove non active containers + sort actions by date.
    for(var index in result.containers) {
      if(result.containers[index].con_active === 'N') {
        //if there are actions logged for the current container in the loop, sort the actions by date
        if(result.containers[index].container_actions) {
          var containerActions = result.containers[index].container_actions;
          containerActions.sort(function(a, b) {
            if (a.ca_creation_dt > b.ca_creation_dt) {
              return -1;
            }
            if (a.ca_creation_dt < b.ca_creation_dt) {
              return 1;
            }
            return 0;
          });
        }
      } else {
        delete result.containers[index];
      }
    }

    //second cleanup step. Create new object for easier CSV mapping
    for(var index in result.containers) {
      var filler, problems = {},
          issues, status = '';

      if(result.containers[index].container_actions) {
        filler = {
          "wasteflow": result.containers[index].container_actions[0].wf_name,
          "department": result.containers[index].container_actions[0].dep_name,
          "building": result.containers[index].container_actions[0].loc_name,
          "date": moment(result.containers[index].container_actions[0].ca_creation_dt, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY HH:mm:ss")
        };

        if(result.containers[index].container_actions[0].issues) {
          issues = result.containers[index].container_actions[0];
          status = 'error',
          problems = {
            "problem_one": issues.issues[0] ? issues.issues[0].it_description : '--',
            "problem_two": issues.issues[1] ? issues.issues[1].it_description : '--'
          };
        }
      }

      var container = {
        "id": result.containers[index].con_id,
        "status": status ? status : 'ok',
        "container_name": result.containers[index].con_name,
        "type": result.containers[index].ct_type,
        "wasteflow": filler && filler.wasteflow ? filler.wasteflow : '--',
        "department": filler && filler.department ? filler.department : '--',
        "building": filler && filler.building ? filler.building : '--',
        "date": filler && filler.date ? filler.date : '--',
        "problem_one": problems && problems.problem_one ? problems.problem_one : '--',
        "problem_two": problems && problems.problem_two ? problems.problem_two : '--'
      };

      vm.containers.push(container);
    }

    vm.tableLoading = false;
  }).error(function(){
    notification = {
      "show": true,
      "status": "error",
      "message": "Er is een probleem opgetreden tijdens het laden van de containers."
    }; broadcastEvent(notification);
  });

  containerOverviewDeactivatedService.getAllDepartments().success(function(result){
    vm.departments = result.items;
  });

  containerOverviewDeactivatedService.getAllLocations().success(function(result){
    vm.locations = result.items;
  });

  containerOverviewDeactivatedService.getAllWasteFlows().success(function(result){
    vm.wasteflows = result.items;
  });

  //update selected filter values
  vm.updateFilter = function(filterObj, isAll, fieldType){
    //update filter active states in filter panel
    globalService.updateFilter(filterObj, isAll, fieldType);
  };

  vm.resetFilterValues = function() {
    //initialize table filters
    vm.filters = {
      "containerStatus": {
        "all": true,
        "ok": false,
        "Verkeerd gesorteerd": false,
        "Defecte container": false
      },
      "containerWasteflow": {
        "all": true,
        "Restafval": false,
        "Papier": false
      },
      "containerType": {
        "all": true,
        "black": false,
        "yellow": false,
        "orange": false,
        "gray": false
      },
      "containerDepartment": {
        "all": true,
        "department": ""
      },
      "containerLocation": {
        "all": true,
        "location": ""
      },
      "containerDate": {
        "all": true,
        "from": "Van",
        "till": "Tot"
      }
    };
  }; vm.resetFilterValues();
}

containerOverviewDeactivatedController.$inject = ['globalService', 'containerOverviewDeactivatedService', 'DTOptionsBuilder'];
