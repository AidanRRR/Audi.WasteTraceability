angular
  .module('audi')
  .service('globalService', globalService);

function globalService() {
  var vm = this,
      pageTitle;

  return {
    getPageTitle: function() {
      return pageTitle;
    },
    setPageTitle: function(newTitle) {
      pageTitle = newTitle;
    },
    updateFilter: function(filterObj, isAll, fieldType) {
      switch (fieldType) {
        case 'date':
          filterObj.from = 'Van';
          filterObj.till = 'Tot';
          break;
        case 'dropdown':
          for(var i in filterObj) {
            if(isAll) {
              if(i !== 'all') {
                filterObj[i] = '';
              }
            }
          }
          break;
        default:
          for(var i in filterObj) {
            if(isAll) {
              if(i !== 'all') {
                filterObj[i] = false;
              }
            } else {
              if(i !== 'all' && filterObj[i]) {
                filterObj.all = false;
              }
            }
          }
          break;
      }
    }
  };

}

globalService.$inject = [];
