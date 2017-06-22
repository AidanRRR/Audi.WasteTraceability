angular
  .module('audi')
  .controller('containerInteractionsController', containerInteractionsController);

function containerInteractionsController(globalService, containerInteractionsService, DTOptionsBuilder, DTColumnDefBuilder){
  var vm = this;

  vm.tableLoading = true;

  //page specific configs
  globalService.setPageTitle('containers - ledigingen');
  vm.filterPanel = 'app/containerInteractions/filter.view.html';

  //set options for datatable
  vm.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withPaginationType('full_numbers')
                    .withDisplayLength(1000)
                    .withOption('order', [6, 'desc']);

    vm.DTColumnDefBuilder = [
        DTColumnDefBuilder.newColumnDef(10).withOption('type','date-uk')
    ];

  //set options for csv export
  vm.csvHeader = ['Status', 'Container #', 'Kleur', 'Afvalstroom', 'Afdeling', 'Gebouw', 'Kostenplaats', 'Verdieping', 'Kolom', 'Actie', 'Laatste leging', 'Probleem', 'Probleem'];

  vm.filteredActions;
  //Storage object for container actions
  vm.actions = [];

  //first get all container actions for every container
  containerInteractionsService.getAllContainers().success(function(result){
    //for every container in our result
    for(var container in result.containers) {
      var issues, status = '',
          problems = {};

      //loop over all actions logged for each container
      for(var action in result.containers[container].container_actions) {
        if(result.containers[container].container_actions[action].issues) {
          issues = result.containers[container].container_actions[action];
          status = 'error',
          problems = {
            "problem_one": issues.issues[0] ? issues.issues[0].it_description : '--',
            "problem_two": issues.issues[1] ? issues.issues[1].it_description : '--'
          };
        }

        var data = {
          "status": status ? status : 'ok',
          "con_name": result.containers[container].con_name,
          "ct_type": result.containers[container].ct_type,
          "wasteflow": result.containers[container].container_actions[action].wf_name_nl,
          "department": result.containers[container].container_actions[action].dep_name,
          "building": result.containers[container].container_actions[action].loc_name,
          "cost_center": result.containers[container].container_actions[action].cc_name.replace('$', ''),
          "floor": result.containers[container].container_actions[action].ldx_floor_code,
          "column": result.containers[container].container_actions[action].ldx_pillar_code,
          "action": result.containers[container].container_actions[action].at_description,
          "date":  moment(result.containers[container].container_actions[action].ca_creation_dt, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY HH:mm:ss"),
          "problem_one": problems && problems.problem_one ? problems.problem_one : '--',
          "problem_two": problems && problems.problem_two ? problems.problem_two : '--'
        };

        vm.actions.push(data);

        //reset variables
        issues    = ''; 
        status    = '';
        problems  = {};
      }

    }
    vm.tableLoading = false;
  });

  containerInteractionsService.getAllDepartments().success(function(result){
    vm.departments = result.items;
  });

  containerInteractionsService.getAllLocations().success(function(result){
    vm.locations = result.items;
  });

  containerInteractionsService.getAllWasteFlows().success(function(result){
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
      "containerAction": {
        "all": true,
        "Plaatsen container": false,
        "Ophalen container": false
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

containerInteractionsController.$inject = ['globalService', 'containerInteractionsService', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

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