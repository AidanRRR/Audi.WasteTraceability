angular
  .module('audi')
  .filter('newStatusFilter', newStatusFilter)
  .filter('actionFilter', actionFilter)
  .filter('newWasteflowFilter', newWasteflowFilter)
  .filter('typeFilter', typeFilter)
  .filter('departmentFilter', departmentFilter)
  .filter('locationFilter', locationFilter)
  .filter('newDateFilter', newDateFilter);


  function newStatusFilter() {
    return function (containers, containerFiltering) {
      var items = {
        containerFiltering: containerFiltering,
        out: []
      };
      angular.forEach(containers, function(value, key) {
        if(this.containerFiltering['all']) {
          this.out.push(value);
        } else if (this.containerFiltering[value.problem_one] || this.containerFiltering[value.problem_two]) {
          this.out.push(value);
        }
      }, items);
      return items.out;
    };
  }

  function actionFilter() {
    return function (containers, containerFiltering) {
      var items = {
        containerFiltering: containerFiltering,
        out: []
      };
      angular.forEach(containers, function(value, key) {
        if(this.containerFiltering['all']) {
          this.out.push(value);
        } else if (this.containerFiltering[value.action]) {
          this.out.push(value);
        }
      }, items);
      return items.out;
    };
  }

  function newWasteflowFilter() {
    return function (containers, containerFiltering) {
      var items = {
        containerFiltering: containerFiltering,
        out: []
      };
      angular.forEach(containers, function(value, key) {
        if(this.containerFiltering['all']) {
          this.out.push(value);
        } else if(this.containerFiltering[value.wasteflow]) {
          this.out.push(value);
        }
      }, items);
      return items.out;
    };
  }

function typeFilter() {
  return function (containers, containerFiltering) {
    var items = {
      containerFiltering: containerFiltering,
      out: []
    };
    angular.forEach(containers, function(value, key) {
      if(this.containerFiltering['all']) {
        this.out.push(value);
      } else if (this.containerFiltering[value.ct_type]) {
        this.out.push(value);
      }
    }, items);
    return items.out;
  };
}

function departmentFilter() {
  return function (containers, containerFiltering) {
    var items = {
      containerFiltering: containerFiltering,
      out: []
    };
    angular.forEach(containers, function(value, key) {
      if(this.containerFiltering['all']) {
        this.out.push(value);
      } else if(this.containerFiltering['department'] === value.department) {
        this.out.push(value);
      }
    }, items);
    return items.out;
  };
}

function locationFilter() {
  return function (containers, containerFiltering) {
    var items = {
      containerFiltering: containerFiltering,
      out: []
    };
    angular.forEach(containers, function(value, key) {
      if(this.containerFiltering['all']) {
        this.out.push(value);
      } else if(this.containerFiltering['location'] === value.building) {
        this.out.push(value);
      }
    }, items);
    return items.out;
  };
}

function newDateFilter() {
  return function (containers, containerFiltering) {
    var items = {
      containerFiltering: containerFiltering,
      out: []
    };
    angular.forEach(containers, function(value, key) {
      if(this.containerFiltering['all']) {
        this.out.push(value);
      } else {
        var actionDate = moment(value.date, "DD/MM/YYYY HH:mm:ss").format("x"),
            fromDate = moment(this.containerFiltering.from, "DD/MM/YYYY").format("x"),
            tillDate = moment(this.containerFiltering.till, "DD/MM/YYYY").format("x");

        if(actionDate > fromDate && actionDate < tillDate) {
          this.out.push(value);
        }
      }
    }, items);
    return items.out;
  };
}
