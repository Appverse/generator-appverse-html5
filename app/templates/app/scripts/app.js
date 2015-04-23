'use strict';

angular.module('App.Controllers', []);

angular.module('<%=appName%>App', ['ngAnimate','appverse.router', 'App.Controllers','appverse'])

.run(['$log',
    function ($log) {
        $log.debug('<%=appName%>App run');
    }]);

AppInit.setConfig({

    // Application general environment
    // Overrides defaults and mobile settings
    environment: {},

    // Settings to use when Appverse Mobile is loaded
    // Will override environment values
    appverseMobile: {},

    //Settings to use when mobile browser is detected
    // Will override environment values
    mobileBrowser: {}
});
