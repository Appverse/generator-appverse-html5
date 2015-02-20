'use strict';

/*
 * Controllers for translation demo.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('App.Controllers')

.controller('translationController', ['$scope', '$translate', 'tmhDynamicLocale',
        function ($scope, $translate, tmhDynamicLocale) {

        $scope.now = new Date();
        $scope.name = 'Alicia';
        $scope.age = '25';

        $scope.setLocale = function (locale) {
            $translate.uses(locale);
            tmhDynamicLocale.set(locale.toLowerCase());
        };
    }]);
