/*jshint node:true */
'use strict';

describe("E2E: Testing Routes <%=name%>", function () {

    it('should have a working /<%=name%> route', function () {
        browser().navigateTo('#/<%=name%>');
        expect(browser().location().path()).toBe("/<%=name%>");
    });

});
