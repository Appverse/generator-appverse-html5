'use strict';

angular.module('App.Controllers')

.controller('homeController',
    function ($log, $scope) {
        $log.debug('homeController loading');

        $scope.greeting = 'Welcome';
    });
