'use strict';

angular.module('App.Controllers', []);

angular.module('<%=appName%>App', ['COMMONAPI', 'App.Controllers'])

.run(['$log',
    function ($log) {

        $log.debug('<%=appName%>App run');
    }]);

AppInit.setConfig({

    // Application general environment
    // Overrides defaults and mobile settings
    environment: {

        "REST_CONFIG": {
            "BaseUrl": "api"
        }
    },

    // Settings to use when Appverse Mobile is loaded
    // Will override environment values
    appverseMobile: {

    },

    //Settings to use when mobile browser is detected
    // Will override environment values
    mobileBrowser: {

    }
});
