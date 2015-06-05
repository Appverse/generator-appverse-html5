/*jshint node:true */
'use strict';

describe("E2E: Testing Routes <%=viewName%>", function () {

    it('should have a working /<%=viewName%> route', function () {
        browser().navigateTo('#/<%=viewName%>');
        expect(browser().location().path()).toBe("/<%=viewName%>");
    });

});
