'use strict';

describe("Unit: Testing <%=name%>", function () {

    beforeEach(angular.mock.module('App.Controllers'));
    beforeEach(angular.mock.module('restangular'));
    beforeEach(angular.mock.module("ui.bootstrap"));

    it('should have a properly working <%=name%> controller', angular.mock.inject(function ($rootScope, $controller) {

        var scope = $rootScope.$new();
        $controller('<%=name%>Controller', {
            $scope: scope
        });

        expect(scope.name).toEqual('<%=lodash.capitalize(name)%>');
    }));

});
