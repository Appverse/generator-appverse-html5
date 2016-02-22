/*jshint node:true */
'use strict';

ngDescribe({
    // your options
    name: 'Unit: <%=name%>',
    modules: ['App.Controllers', 'appverse.cache', 'appverse.rest', 'restangular', 'ui.bootstrap'],
    controllers: '<%=name%>Controller',
    tests: function(deps) {
        it('should have a properly working <%=name%> controller', function() {
            var scope = deps['<%=name%>Controller'];
            expect(scope.gridOptions).not.toEqual(undefined);
        });
    }
});