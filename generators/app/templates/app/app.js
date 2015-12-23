/*global AppInit:false*/

(function () {
    'use strict';

    angular.module('App.Controllers', []);

    angular.module('<%=appName%>App', [
        'ngAnimate',
        'ui.bootstrap',
        'angularRipple',
        'ui.select',
        'ngSanitize',
        'rzModule',
        'rt.resize',
        'chart.js',
        'xeditable',
        'ngGrid',
        'appverse.router',
        'App.Controllers',
        'appverse',
        'ngMdIcons'
    ]).run(function ($log,editableOptions) {
        $log.debug('testAlphaApp run');
        editableOptions.theme = 'bs3';
        $('#menu-toggle').click(function(e) {
            e.preventDefault();
            $('#wrapper').toggleClass('toggled');
       });
    });

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


    //you can inject stuff!
  angular.module('<%=appName%>App').animation('.fade-in', function () {
  return {
    enter: function(element, done) {
      element.css({
        opacity: 0
      })
      .animate({
        opacity: 1
        }, 1000, done);
    }
  };
});

})();
