/*jshint node:true */
'use strict';

describe('E2E: Testing Routes', function() {

    it('should jump to the /home path when / is accessed', function() {
        browser.setLocation('');
        expect(browser.getLocationAbsUrl()).toBe('/home');
    });
});