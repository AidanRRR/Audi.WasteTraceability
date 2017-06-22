angular
  .module('audi')
  //.constant("baseUrl", "http://52.18.52.180/ords/audi_ab")
  .constant("baseUrl", "http://audibxua0116:8080/ords/afvalusra")
  .config(appConfig);

function appConfig($compileProvider, $locationProvider){
  //Set this to false when deploying to production
  $compileProvider.debugInfoEnabled(true);
  //remove # from url
  $locationProvider.html5Mode(true);
}

appConfig.$inject = ['$compileProvider', '$locationProvider'];