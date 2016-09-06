/*jshint node:true */
'use strict';

describe('E2E: Testing <%=name%> view', function() {

    beforeAll(function() {
        browser.setLocation('<%=name%>');
    });

    it('should have a working <%=name%> route', function() {
        expect(browser.getLocationAbsUrl()).toBe('/<%=name%>');
    });

    it('should have a div with <%=name%>', function() {
        expect(element(by.exactBinding('name')).getText()).toBe('Name: <%=name%>');
    });
});