'use strict';

describe("Unit: Testing <%=name%>", function () {

    beforeEach(angular.mock.module('App.Controllers'));

    it('should have a properly working <%=name%> controller', angular.mock.inject(function ($rootScope, $controller) {

        var scope = $rootScope.$new();
        $controller('<%=name%>', {
            $scope: scope
        });

        expect(scope.name).toEqual('<%=name%>');
    }));

});
