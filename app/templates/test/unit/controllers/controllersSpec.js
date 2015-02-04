//
// test/unit/controllers/controllersSpec.js
//
describe("Unit: Testing Controllers", function() {

  beforeEach(App = angular.mock.module('<%=appName%>App'));

  it('should have a homeController controller', function() {
    expect(App.homeController).not.to.equal(null);
  });

  it('should have a taskController controller', function() {
    expect(App.taskController).not.to.equal(null);
  });

  it('should have a properly working homeController controller', inject(function($rootScope, $controller) {
    var searchTestAtr = 'cars';

    var $scope = $rootScope.$new();
    var ctrl = $controller('homeController', {
      $scope : $scope
    });
  }));

  it('should have a properly working taskController controller', inject(function($rootScope, $controller) {
    var $scope = $rootScope.$new();

    //we're stubbing the onReady event
    $scope.onReady = function() { };
    var ctrl = $controller('taskController', {
      $scope : $scope
    });
  }));

});
