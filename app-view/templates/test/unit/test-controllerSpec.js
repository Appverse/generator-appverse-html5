'use strict';

describe("Unit: Testing <%=controllerName%>", function () {

    beforeEach(angular.mock.module('App.Controllers'));

    it('should have a properly working <%=controllerName%> controller', angular.mock.inject(function ($rootScope, $controller) {

        var scope = $rootScope.$new();
        $controller('<%=controllerName%>', {
            $scope: scope
        });

        expect(scope.name).toEqual('<%=viewName%>');
    }));

});
