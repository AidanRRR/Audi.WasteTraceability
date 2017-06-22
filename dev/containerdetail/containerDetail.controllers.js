angular
  .module('audi')
  .controller('containerDetailController', containerDetailController);

function containerDetailController(globalService, containerDetailService, $routeParams, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, ngDialog, $route){
  var vm = this;

  vm.filterPanel = 'app/containerDetail/filter.view.html';

  vm.tableLoading = true;

  //set options for datatable
  vm.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withPaginationType('full_numbers')
                    .withDisplayLength(1000)
                    .withOption('order', [3, 'desc']);

    vm.DTColumnDefBuilder = [
        DTColumnDefBuilder.newColumnDef(3).withOption('type','date-uk')
    ];

  vm.filteredActions;
  //set options for csv export
  vm.csvHeader = ['Status', 'Probleem 1', 'Foto ID', 'Probleem 2', 'Foto ID', 'Datum'];

  containerDetailService.getContainerByID($routeParams.containerId).success(function(result){
    vm.container = [];
    vm.containerInfo = result.containers[0];

    globalService.setPageTitle('<span ng-switch-default class="container--' + result.containers[0].ct_type + '"><span class="icon__text">a</span></span> historiek ' + vm.containerInfo.con_name);

    if(result.containers[0].container_actions) {
      for(var i in vm.containerInfo.container_actions) {
        var issues = vm.containerInfo.container_actions[i].issues,
            problems = {};

        if(issues) {
          problems = {
            "one": issues[0] ? issues[0].it_description : false,
            "image_one": issues[0] ? issues[0].iss_id : false,
            "two": issues[1] ? issues[1].it_description : false,
            "image_two": issues[1] ? issues[1].iss_id : false
          };
        }

        var action = {
          "status": !issues ? 'ok' : 'error',
          "problem_one": problems ? problems.one : false,
          "image_one": problems ? problems.image_one : false,
          "problem_two": problems ? problems.two : false,
          "image_two": problems ? problems.image_two : false,
          "date": moment(vm.containerInfo.container_actions[i].ca_creation_dt, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY HH:mm:ss")
        };

        vm.container.push(action);
      }
    } else {
      notification = {
        "show": true,
        "status": "warning",
        "message": "Er werden geen acties voor deze container gevonden."
      }; broadcastEvent(notification);
    }

    vm.tableLoading = false;
  });

  vm.disableContainer = function(){
    containerDetailService.disableContainer(vm.containerInfo).success(function(result){
      $route.reload();

      notification = {
        "show": true,
        "status": "success",
        "message": "Deze container werd gedeactiveerd."
      }; broadcastEvent(notification);
    });
  };

  vm.enableContainer = function(){
    containerDetailService.enableContainer(vm.containerInfo).success(function(result){
      $route.reload();

      notification = {
        "show": true,
        "status": "success",
        "message": "Deze container werd geactiveerd."
      }; broadcastEvent(notification);
    });
  };

  vm.viewImage = function(issue_ID, issue_type) {
    ngDialog.open({
      template: 'app/dialogs/viewImage.dialog.html',
      className: 'ngdialog-theme-default dialog',
      controller: 'dialogsController',
      controllerAs: 'vm',
      data: {"id": issue_ID, "type": issue_type}
    });
  };

  vm.viewBarcode = function(barcode) {
    ngDialog.open({
      template: 'app/dialogs/reprintBarcode.dialog.html',
      className: 'ngdialog-theme-default dialog',
      controller: 'dialogsController',
      controllerAs: 'vm',
      data: {"barcode": barcode}
    });
  };

  vm.updateFilter = function(filterObj, isAll, fieldType){
    //update filter active states in filter panel
    globalService.updateFilter(filterObj, isAll, fieldType);
  };

  //initialize table filters
  vm.resetFilterValues = function() {
    vm.filters = {
      "containerStatus": {
        "all": true,
        "ok": false,
        "Verkeerd gesorteerd": false,
        "Defecte container": false
      },
      "containerDate": {
        "all": true,
        "from": "Van",
        "till": "Tot"
      }
    };
  }; vm.resetFilterValues();

  function broadcastEvent(data){
    $rootScope.$broadcast('notification-push', data);
  }

}

containerDetailController.$inject = ['globalService', 'containerDetailService', '$routeParams', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ngDialog', '$route'];

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