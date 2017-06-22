angular
  .module('audi')
  .controller('containerOverviewController', containerOverviewController);

function containerOverviewController(globalService, containerOverviewService, DTOptionsBuilder, DTColumnDefBuilder, $rootScope){
  var vm = this;

  //page specific configs
  globalService.setPageTitle('container overzicht');
  vm.filterPanel = 'app/containerOverview/filter.view.html';

  vm.tableLoading = true;

  //set options for datatable
  vm.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withPaginationType('full_numbers')
                    .withDisplayLength(1000)
                    .withOption('order', [6, 'desc']);

  vm.DTColumnDefBuilder = [
      DTColumnDefBuilder.newColumnDef(9).withOption('type','date-uk')
  ];

    //set options for csv export
  vm.csvHeader = ['Id', 'Status', 'Container #', 'Kleur', 'Afvalstroom', 'Afdeling', 'Gebouw', 'Kostenplaats', 'Verdieping', 'Kolom', 'Laatste leging', 'Probleem', 'Probleem'];

  vm.filteredContainers;

  containerOverviewService.getAllContainers().success(function(result){
    var wrongsort,
        damagedcont;

    vm.containers = [];
      //first cleanup step. Remove non active containers + sort actions by date.
      for(var index in result.containers) {
          if(result.containers[index].con_active === 'Y') {
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
          "wasteflow": result.containers[index].container_actions[0].wf_name_nl,
          "department": result.containers[index].container_actions[0].dep_name,
          "building": result.containers[index].container_actions[0].loc_name,
          "costcenter": result.containers[index].container_actions[0].cc_name.replace('$', ''),
          "floor": result.containers[index].container_actions[0].ldx_floor_code,
          "column": result.containers[index].container_actions[0].ldx_pillar_code,
          "date": moment(result.containers[index].container_actions[0].ca_creation_dt, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY HH:mm:ss")
        };

        if(result.containers[index].container_actions[0].issues) {
          issues = result.containers[index].container_actions[0];
          status = "error",
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
        "costcenter": filler && filler.costcenter ? filler.costcenter : '--',
        "floor": filler && filler.floor ? filler.floor : '--',
        "column": filler && filler.column ? filler.column : '--',
        "date": filler && filler.date ? filler.date : '--',
        "problem_one": problems && problems.problem_one ? problems.problem_one : '--',
        "problem_two": problems && problems.problem_two ? problems.problem_two : '--'
      };

      vm.containers.push(container);

      //reset variables after each loop
      filler    = {};
      problems  = {};
      issues    = ''; 
      status    = '';
    }

    vm.tableLoading = false;

  }).error(function(){
    notification = {
      "show": true,
      "status": "error",
      "message": "Er is een probleem opgetreden tijdens het laden van de containers."
    }; broadcastEvent(notification);
  });

  containerOverviewService.getAllDepartments().success(function(result){
    vm.departments = result.items;
  });

  containerOverviewService.getAllLocations().success(function(result){
    vm.locations = result.items;
  });

  containerOverviewService.getAllWasteFlows().success(function(result){
    vm.wasteflows = result.items;
  });

  containerOverviewService.getLastContainerAction().success(function(result) {
    vm.containeraction = result.items;

    if (vm.containeraction[0].viewed=='N') {
        notification = {
            "show": true,
            "status": "success",
            "message": "Er zijn nieuwe container interacties!"
        };
        broadcastEvent(notification);
    }

    containerOverviewService.postLastContainerActionViewed(vm.containeraction[0]);

  });

  


  function broadcastEvent(data){
        $rootScope.$broadcast('notification-push', data);
    }

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
        "all": true
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

containerOverviewController.$inject = ['globalService', 'containerOverviewService', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$rootScope'];

$.extend( jQuery.fn.dataTableExt.oSort, {
    "date-uk-pre": function (a){
        return parseInt(moment(a, "DD/MM/YYYY HH:mm").format("X"), 10);
    },
    "date-uk-asc": function (a, b) {
        return a - b;
    },
    "date-uk-desc": function (a, b) {
        return b - a;
    }
});