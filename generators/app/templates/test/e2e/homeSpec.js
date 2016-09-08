/*jshint node:true */
'use strict';

describe('E2E: Testing home view', function() {

    beforeAll(function() {
        browser.setLocation('home');
    });

    it('should have a working /home route', function() {
        expect(browser.getLocationAbsUrl()).toBe('/home');
    });

    it('should have a greeting title', function() {
        expect(element(by.exactBinding('greeting')).getText()).toBe('Welcome to \'<%=appName%>\'');
    });

});