angular
  .module('audi')
  .filter('statusDetailFilter', statusDetailFilter)
  .filter('dateDetailFilter', dateDetailFilter);

function statusDetailFilter() {
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

function dateDetailFilter() {
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
