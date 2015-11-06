'use strict';

describe('Service: teamSrvc', function () {

  // load the service's module
  beforeEach(module('teamDashboardApp'));

  // instantiate service
  var teamSrvc;
  beforeEach(inject(function (_teamSrvc_) {
    teamSrvc = _teamSrvc_;
  }));

  it('should do something', function () {
    expect(!!teamSrvc).toBe(true);
  });

});
