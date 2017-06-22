angular
  .module('audi')
  .controller('partialController', partialController);

function partialController(globalService, $scope, ngDialog, $timeout) {
  var vm = this;

  $scope.$watch(function(){
    return globalService.getPageTitle();
  }, function (newValue) {
    vm.pageTitle = newValue
  });

  $scope.$on('notification-push', function(event, data) {
    vm.notification = data;
    resetMessage();
  });

  vm.partials = {
    "header": "app/partials/header.view.html"
  };

  vm.newDialog = function(type) {
    ngDialog.open({
      template: 'app/dialogs/' + type + '.dialog.html',
      className: 'ngdialog-theme-default dialog',
      controller: 'dialogsController',
      controllerAs: 'vm'
    });
  };

  function resetMessage(){
    $timeout(function(){
      vm.notification = {
        "show": false
      };
    }, 2000);
  }

}

partialController.$inject = ['globalService', '$scope', 'ngDialog', '$timeout'];
