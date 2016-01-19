'use strict';

ngDescribe({
    // your options
    name: 'Unit: <%=name%>',
    modules: ['App.Controllers', 'restangular', 'ui.bootstrap'],
    controllers: '<%=name%>Controller',
    inject: ['$rootScope'],
    tests: function (deps) {
        it('should have a properly working <%=name%> controller', function () {
            var scope = deps.<%=name%>Controller;
            // deps.dController is the $scope object injected into dController
             expect(scope.name).toEqual('<%=lodash.capitalize(name)%>');
        });
    }
});
