/*jshint node:true, jquery:true */
'use strict';

describe('E2E: Testing <%=name%> view', function() {

    beforeAll(function() {
        browser.setLocation('<%=name%>');
    });

    it('should have a working <%=name%> route', function() {
        expect(browser.getLocationAbsUrl()).toBe('/<%=name%>');
    });

    it('should have a h1 with <%=name%>', function() {
        expect($('h1').getText()).toBe('<%=lodash.capitalize(name)%>');
    });
});