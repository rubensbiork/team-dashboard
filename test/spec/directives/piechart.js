'use strict';

describe('Directive: pieChart', function () {

  // load the directive's module
  beforeEach(module('teamDashboardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<pie-chart></pie-chart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the pieChart directive');
  }));
});
