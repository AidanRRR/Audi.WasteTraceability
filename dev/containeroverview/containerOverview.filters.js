angular
  .module('audi')
  .filter('newTypeFilter', newTypeFilter)
  .filter('newStatusFilter', newStatusFilter)
  .filter('newWasteflowFilter', newWasteflowFilter)
  .filter('newDepartmentFilter', newDepartmentFilter)
  .filter('newLocationFilter', newLocationFilter)
  .filter('newDateFilter', newDateFilter);

function newTypeFilter() {
  return function (containers, containerFiltering) {
    var items = {
      containerFiltering: containerFiltering,
      out: []
    };

    angular.forEach(containers, function(value, key){
      if(this.containerFiltering['all']) {
        this.out.push(value);
      } else if(this.containerFiltering[value.type]) {
        this.out.push(value);
      }
    }, items);
    return items.out;
  }
}

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

function newDepartmentFilter() {
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

function newLocationFilter() {
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
